import { Code2, Target, Users2 } from "lucide-react"

export default function About() {
  const team = [
    { name: "Dhananjay Misal", role: "Co Founder CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" },
    { name: "Swastik Rasal", role: "Founder CEO", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300" }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <div className="bg-gradient-to-tr from-[#111] to-[#0A0A0A] border border-white/5 rounded-2xl p-8 max-w-4xl mx-auto w-full text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mt-2 mb-4">
          We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">DevStart</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
          A team of engineers and designers dedicated to helping startups ship faster and look better doing it.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 h-full flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/5 blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 tracking-tight">Our Story</h2>
            <div className="space-y-4 text-xs text-gray-400 leading-relaxed">
              <p>
                We started DevStart because we noticed a gap in the market. Startups either had to hire expensive generic agencies that didn't understand software products, or piece together freelancers with mixed results.
              </p>
              <p>
                We built an agency tailored specifically for startups. We use the same modern stacks (React, Next.js, Node) that high-growth companies use, ensuring your product is scalable from day one.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                <h3 className="text-2xl font-black text-purple-400 mb-1 tracking-tighter">50+</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Startups</p>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                <h3 className="text-2xl font-black text-blue-400 mb-1 tracking-tighter">10k+</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Commits</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Values</h2>
            <div className="flex flex-col gap-4">
              {[
                { icon: Target, title: "Mission Driven", desc: "Goal is your success, advising strategy.", c: "text-purple-400 bg-purple-500/10" },
                { icon: Code2, title: "Modern Tech", desc: "No legacy code, only scalable stacks.", c: "text-blue-400 bg-blue-500/10" },
                { icon: Users2, title: "True Partners", desc: "Technical co-founders for the early stages.", c: "text-green-400 bg-green-500/10" }
              ].map((v, i) => (
                <div key={i} className="flex gap-4 items-center bg-white/5 border border-white/5 rounded-xl p-3">
                  <div className={`p-2 rounded-lg ${v.c}`}>
                    <v.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs tracking-tight text-gray-100">{v.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Core Team</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {team.map((member, i) => (
                <div key={i} className="min-w-[140px] flex-1 text-center bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all rounded-xl p-6 group relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <h4 className="font-extrabold text-sm text-gray-200 tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300 transform group-hover:scale-105 whitespace-nowrap">
                     {member.name}
                   </h4>
                   <p className="text-[10px] text-purple-400 font-mono mt-2 uppercase tracking-widest truncate">
                     {member.role}
                   </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
