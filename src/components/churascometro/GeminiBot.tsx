import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { SendHorizontal } from "lucide-react"
import { useState } from "react"

type Message = {
  role: "user" | "bot"
  content: string
}

export default function GeminiInReact() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Olá! Como posso ajudar você hoje?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAFD7JrM-kLyDsA8sLjWiFeRtDZ82A9shg",
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const userMessage: Message = { role: "user", content: input }
      setMessages((prevMessages) => [...prevMessages, userMessage])
      setInput("")

      try {
        setLoading(true)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const result = await model.generateContent(
          `Responda em português: ${input}`,
        )
        const botResponse: Message = {
          role: "bot",
          content: result.response.text(),
        }
        setMessages((prevMessages) => [...prevMessages, botResponse])
      } catch (error) {
        console.error("Something went wrong", error)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "bot",
            content: "Desculpe, algo deu errado. Tente novamente.",
          } as Message,
        ])
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col h-[600px]  max-w-md mx-auto overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-black text-white text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 w-full border-t">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Peça para IA calcular o churrasco"
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={loading}>
            {loading ? (
              <span className="spinner-border text-primary" role="status">
                <span className="sr-only">Carregando...</span>
              </span>
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Enviar</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
