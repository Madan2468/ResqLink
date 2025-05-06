"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm the ResQLink assistant. How can I help you with emergency services today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate chatbot response instead of making API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a response based on the user's input
      let botResponse =
        "I'm here to help with emergency situations. Could you provide more details about your emergency?"

      const userInput = input.toLowerCase()

      if (userInput.includes("emergency") || userInput.includes("help")) {
        botResponse =
          "If you're experiencing an emergency, please call 911 immediately. You can also use our emergency request form to get assistance."
      } else if (userInput.includes("medical") || userInput.includes("injury") || userInput.includes("hurt")) {
        botResponse =
          "For medical emergencies, please call 911. If it's not life-threatening, I can guide you through basic first aid steps or connect you with medical professionals."
      } else if (userInput.includes("fire")) {
        botResponse =
          "If there's a fire, evacuate immediately and call 911. Do not attempt to fight a large fire yourself."
      } else if (userInput.includes("location") || userInput.includes("where")) {
        botResponse =
          "You can share your location with emergency services through our app. This helps responders find you quickly in an emergency."
      } else if (userInput.includes("hello") || userInput.includes("hi") || userInput.includes("hey")) {
        botResponse = "Hello! I'm the ResQLink assistant. How can I help you today?"
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error with chatbot:", error)

      // Fallback response if something goes wrong
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm having trouble processing your request. Please try again later or call emergency services directly if you need immediate assistance.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col">
      <CardHeader className="bg-red-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          ResQLink Assistant
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start gap-2 max-w-[80%]">
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8 bg-red-100">
                    <MessageSquare className="h-4 w-4 text-red-600" />
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 bg-primary/25">
                    <div className="text-xs font-medium">You</div>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
