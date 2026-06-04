import json
import os
import socket
import struct
import hashlib
import hmac
import base64
import os as _os
import urllib.parse


def _pg_connect(host, port, user, password, database):
    sock = socket.create_connection((host, int(port)), timeout=15)

    def send_raw(data):
        sock.sendall(data)

    def recv_exact(n):
        buf = b""
        while len(buf) < n:
            chunk = sock.recv(n - len(buf))
            if not chunk:
                raise ConnectionError("Connection closed")
            buf += chunk
        return buf

    def recv_msg():
        header = recv_exact(5)
        msg_type = header[0:1]
        length = struct.unpack("!I", header[1:5])[0]
        body = recv_exact(length - 4) if length > 4 else b""
        return msg_type, body

    def send_msg(msg_type, body):
        send_raw(msg_type + struct.pack("!I", len(body) + 4) + body)

    # Startup
    params = b"user\x00" + user.encode() + b"\x00database\x00" + database.encode() + b"\x00\x00"
    startup = struct.pack("!I", 196608) + params
    send_raw(struct.pack("!I", len(startup) + 4) + startup)

    # Auth loop
    while True:
        msg_type, body = recv_msg()
        if msg_type == b"R":
            auth_type = struct.unpack("!I", body[:4])[0]
            if auth_type == 0:
                break
            elif auth_type == 3:
                # Cleartext password
                send_msg(b"p", password.encode() + b"\x00")
            elif auth_type == 5:
                # MD5
                salt = body[4:8]
                h1 = hashlib.md5((password + user).encode()).hexdigest().encode()
                h2 = b"md5" + hashlib.md5(h1 + salt).hexdigest().encode() + b"\x00"
                send_msg(b"p", h2)
            elif auth_type == 10:
                # SCRAM-SHA-256
                mechanisms = body[4:].rstrip(b"\x00")
                client_nonce = base64.b64encode(_os.urandom(18)).decode()
                client_first_bare = f"n={user},r={client_nonce}"
                client_first = "n,," + client_first_bare
                sasl_msg = b"SCRAM-SHA-256\x00" + struct.pack("!I", len(client_first)) + client_first.encode()
                send_msg(b"p", sasl_msg)

                # Server first
                _, server_first_body = recv_msg()
                auth_type2 = struct.unpack("!I", server_first_body[:4])[0]
                server_first = server_first_body[4:].decode()

                parts = dict(kv.split("=", 1) for kv in server_first.split(","))
                server_nonce = parts["r"]
                server_salt = base64.b64decode(parts["s"])
                iterations = int(parts["i"])

                # Salted password
                salted_pw = hashlib.pbkdf2_hmac("sha256", password.encode(), server_salt, iterations)
                client_key = hmac.new(salted_pw, b"Client Key", hashlib.sha256).digest()
                stored_key = hashlib.sha256(client_key).digest()

                channel_binding = base64.b64encode(b"n,,").decode()
                client_final_without_proof = f"c={channel_binding},r={server_nonce}"
                auth_message = f"{client_first_bare},{server_first},{client_final_without_proof}"

                client_sig = hmac.new(stored_key, auth_message.encode(), hashlib.sha256).digest()
                client_proof = base64.b64encode(bytes(a ^ b for a, b in zip(client_key, client_sig))).decode()
                client_final = f"{client_final_without_proof},p={client_proof}"

                send_msg(b"p", client_final.encode())
                # Continue loop — server will send R(12) then R(0)
            elif auth_type == 12:
                # SASL Final — verification, just continue waiting for R(0)
                pass
            else:
                raise Exception(f"Unsupported auth type: {auth_type}")
        elif msg_type == b"E":
            raise Exception(f"Auth error: {body.decode(errors='replace')}")
        elif msg_type == b"Z":
            break

    # Wait ReadyForQuery
    while True:
        msg_type, body = recv_msg()
        if msg_type == b"Z":
            break
        elif msg_type == b"E":
            raise Exception(f"Startup error: {body.decode(errors='replace')}")

    return sock, recv_msg, send_msg


def _run_query(sock, recv_msg, send_msg, sql):
    query_bytes = sql.encode("utf-8") + b"\x00"
    send_msg(b"Q", query_bytes)

    rows = []
    columns = []
    error = None

    while True:
        msg_type, body = recv_msg()
        if msg_type == b"T":
            num_cols = struct.unpack("!H", body[:2])[0]
            offset = 2
            for _ in range(num_cols):
                end = body.index(b"\x00", offset)
                columns.append(body[offset:end].decode())
                offset = end + 1 + 18
        elif msg_type == b"D":
            num_cols = struct.unpack("!H", body[:2])[0]
            offset = 2
            row = []
            for _ in range(num_cols):
                col_len = struct.unpack("!i", body[offset:offset + 4])[0]
                offset += 4
                if col_len == -1:
                    row.append(None)
                else:
                    row.append(body[offset:offset + col_len].decode())
                    offset += col_len
            rows.append(row)
        elif msg_type == b"C":
            pass
        elif msg_type == b"E":
            error = body.decode(errors="replace")
        elif msg_type == b"Z":
            break

    if error:
        raise Exception(error)
    return columns, rows


def handler(event: dict, context) -> dict:
    """Регистрирует пользователя — сохраняет имя и email в базу данных."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    name = (body.get("name") or "").strip()
    email = (body.get("email") or "").strip().lower()

    if not name or not email:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Имя и email обязательны"}),
        }

    if "@" not in email or "." not in email:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Некорректный email"}),
        }

    db_url = os.environ["DATABASE_URL"]
    parsed = urllib.parse.urlparse(db_url)
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")

    host = parsed.hostname
    port = parsed.port or 5432
    user = parsed.username
    password = parsed.password or ""
    database = parsed.path.lstrip("/")

    safe_name = name.replace("'", "''")
    safe_email = email.replace("'", "''")

    sock, recv_msg_fn, send_msg_fn = _pg_connect(host, port, user, password, database)

    _, rows = _run_query(sock, recv_msg_fn, send_msg_fn,
        f"SELECT id FROM {schema}.registrations WHERE email = '{safe_email}'")
    if rows:
        sock.close()
        return {
            "statusCode": 409,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Этот email уже зарегистрирован"}),
        }

    _, result = _run_query(sock, recv_msg_fn, send_msg_fn,
        f"INSERT INTO {schema}.registrations (name, email) VALUES ('{safe_name}', '{safe_email}') RETURNING id")
    sock.close()

    new_id = int(result[0][0]) if result else None
    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"success": True, "id": new_id}),
    }