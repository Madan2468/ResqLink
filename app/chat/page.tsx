import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"
import { ChatInterface } from "@/components/chatbot/chat-interface"

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            <span className="text-xl font-bold">ResQLink</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/" className="flex items-center text-sm font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Emergency Assistant</h1>
            <p className="text-gray-500 max-w-[600px] mx-auto">
              Chat with our AI assistant to get help with emergency situations, find resources, or learn about emergency
              procedures.
            </p>
          </div>

          <ChatInterface />

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-red-800 font-medium">
              For immediate life-threatening emergencies, please call 911 or your local emergency number directly.
            </p>
          </div>
        </div>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">© 2024 ResQLink. All rights reserved.</p>
            <p className="text-sm text-gray-500">
              Emergency Hotline:{" "}
              <a href="tel:911" className="font-medium hover:underline">
                911
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
