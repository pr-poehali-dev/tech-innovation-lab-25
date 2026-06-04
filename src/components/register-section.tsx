import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/ui/icon"

const REGISTER_URL = "https://functions.poehali.dev/d34aeec1-dae7-40af-afad-247e91c6b45f"

export function RegisterSection() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setStatus("loading")
    setErrorMsg("")

    const res = await fetch(REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim() }),
    })
    const data = await res.json()

    if (res.ok && data.success) {
      setStatus("success")
    } else {
      setStatus("error")
      setErrorMsg(data.error || "Что-то пошло не так")
    }
  }

  return (
    <section id="register" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-sm font-medium">Ранний доступ</span>
        </div>

        <h2 className="text-4xl font-bold text-white mb-4 font-orbitron">
          Получи <span className="text-red-500">бесплатный доступ</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Зарегистрируйтесь сейчас и первым получите полный доступ к Nova AI
        </p>

        {status === "success" ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <Icon name="CheckCircle" size={32} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Вы в списке!</h3>
            <p className="text-gray-400">
              Мы уведомим вас на <span className="text-white font-medium">{email}</span>, когда откроем доступ.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 bg-zinc-900 border-white/10 text-white placeholder:text-gray-600 focus:border-red-500/50 h-12"
              />
              <Input
                type="email"
                placeholder="Email адрес"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-zinc-900 border-white/10 text-white placeholder:text-gray-600 focus:border-red-500/50 h-12"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <Icon name="AlertCircle" size={16} />
                {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              disabled={status === "loading" || !name.trim() || !email.trim()}
              className="bg-red-500 hover:bg-red-600 text-white border-0 h-12 text-base font-medium w-full sm:w-auto sm:px-12 mx-auto pulse-button"
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Регистрирую...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Icon name="Zap" size={16} />
                  Получить доступ бесплатно
                </span>
              )}
            </Button>

            <p className="text-gray-600 text-xs">
              Никакого спама. Только важные обновления Nova AI.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
