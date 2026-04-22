import { MessageCircle } from "lucide-react"

export default function WhatsAppWidget() {
  return (
    <a
      href="https://wa.me/919307110757"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1EBE5D] text-white p-4 rounded-full shadow-lg shadow-green-500/20 transition-all hover:scale-110 flex items-center justify-center group"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-4 bg-[#0A0A0A] border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Chat with us!
      </span>
    </a>
  )
}
