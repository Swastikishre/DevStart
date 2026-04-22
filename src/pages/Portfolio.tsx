import { motion } from "motion/react"
import { ExternalLink, Github } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Portfolio() {
  const projects: any[] = []

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 flex-1">
      <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Work</span></h1>
          <p className="text-xs text-gray-400 mt-1">projects coming soon</p>
        </div>
      </div>

      <div className="flex-1 border border-white/5 bg-[#0A0A0A] rounded-2xl flex items-center justify-center min-h-[300px]">
         <div className="text-center opacity-50">
           <div className="w-16 h-16 rounded-2xl border border-white/10 mx-auto flex items-center justify-center mb-4">
             <span className="text-gray-500 font-bold block">0</span>
           </div>
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Projects Coming Soon</p>
         </div>
      </div>
    </div>
  )
}
