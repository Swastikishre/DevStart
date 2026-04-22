import { MessageCircle, Instagram } from "lucide-react"
import { motion } from "motion/react"
import { useLocation } from "react-router-dom"

export default function SocialWidgets() {
  const location = useLocation()
  
  // Only visible on Home page
  if (location.pathname !== "/") return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4">
      {/* Instagram Widget */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <motion.a
          href="https://instagram.com/swastik_43210"
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-4 rounded-full shadow-lg shadow-purple-500/20 transition-all hover:scale-110 flex items-center justify-center group overflow-hidden"
          whileHover={{ scale: 1.15 }}
          animate={{
            boxShadow: [
              "0 0 0px rgba(168, 85, 247, 0.4)",
              "0 0 20px rgba(168, 85, 247, 0.6)",
              "0 0 0px rgba(168, 85, 247, 0.4)"
            ]
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity }
          }}
        >
          {/* Glittering / Shining Effect */}
          <motion.div
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg]"
            animate={{
              left: ["-100%", "200%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "linear"
            }}
          />
          <Instagram className="w-7 h-7 relative z-10" />
          <span className="absolute right-full mr-4 bg-[#0A0A0A] border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Follow on Instagram
          </span>
        </motion.a>
      </motion.div>

      {/* WhatsApp Widget */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.8
        }}
      >
        <motion.a
          href="https://wa.me/919307110757"
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-[#25D366] hover:bg-[#1EBE5D] text-white p-4 rounded-full shadow-lg shadow-green-500/20 transition-all hover:scale-110 flex items-center justify-center group overflow-hidden"
          whileHover={{ scale: 1.15 }}
          animate={{
            boxShadow: [
              "0 0 0px rgba(37, 211, 102, 0.4)",
              "0 0 20px rgba(37, 211, 102, 0.6)",
              "0 0 0px rgba(37, 211, 102, 0.4)"
            ]
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity, delay: 0.5 }
          }}
        >
          {/* Glittering / Shining Effect */}
          <motion.div
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg]"
            animate={{
              left: ["-100%", "200%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "linear"
            }}
          />
          <MessageCircle className="w-7 h-7 relative z-10" />
          <span className="absolute right-full mr-4 bg-[#0A0A0A] border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Chat with us!
          </span>
        </motion.a>
      </motion.div>
    </div>
  )
}
