import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Icon from "@/components/ui/icon"

const CHAT_URL = "https://functions.poehali.dev/792ba9e1-37c9-4f0d-ae80-fae534e3f472"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "Напиши функцию на Python для сортировки списка",
  "Придумай идею для нового изобретения в медицине",
  "Объясни, как работает нейросеть простыми словами",
  "Как запустить стартап с нуля?",
]

export function AIChatSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async (text?: string) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    const newMessages: Message[] = [...messages, { role: "user", content: userText }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    const res = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    })
    const data = await res.json()
    setMessages([...newMessages, { role: "assistant", content: data.reply || "Ошибка ответа" }])
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <section id="chat" className="py-24 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 font-orbitron">
            Попробуй <span className="text-red-500">Nova AI</span> прямо сейчас
          </h2>
          <p className="text-gray-400 text-lg">
            Задай любой вопрос, попроси написать код или придумать изобретение
          </p>
        </div>

        <div className="border border-red-500/20 rounded-2xl overflow-hidden bg-zinc-950">
          {/* Chat messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center gap-6">
                <p className="text-gray-500 text-sm">Начните диалог или выберите пример:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="text-left text-sm text-gray-400 border border-red-500/20 rounded-lg px-4 py-3 hover:border-red-500/50 hover:text-white transition-all duration-200 bg-black/40"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name="Bot" size={14} className="text-red-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-red-500/20 text-white border border-red-500/30"
                      : "bg-zinc-900 text-gray-200 border border-white/10"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name="User" size={14} className="text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
                  <Icon name="Bot" size={14} className="text-red-400" />
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-red-500/20 p-4 flex gap-3 items-end bg-black/60">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите сообщение... (Enter для отправки)"
              className="flex-1 resize-none bg-zinc-900 border-white/10 text-white placeholder:text-gray-600 focus:border-red-500/50 min-h-[44px] max-h-32"
              rows={1}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-red-500 hover:bg-red-600 text-white border-0 h-11 w-11 p-0 flex-shrink-0"
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
