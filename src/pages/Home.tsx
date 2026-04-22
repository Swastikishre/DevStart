import { motion, useMotionTemplate, useMotionValue } from "motion/react"
import { ArrowRight, CheckCircle2, Code2, Layout as LayoutIcon, Rocket, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { useState, useEffect, MouseEvent } from "react"
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
}

export default function Home() {
  const [requests, setRequests] = useState<any[]>([])

  // Interactive mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  useEffect(() => {
    const twentyFourHoursAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000))

    const q = query(
      collection(db, "requests"),
      where("createdAt", ">=", twentyFourHoursAgo),
      orderBy("createdAt", "desc"),
      limit(3)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveReqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setRequests(liveReqs)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="w-full flex md:grid grid-cols-12 flex-col gap-4 p-4">
      <div className="col-span-7 flex flex-col gap-4">
        {/* Interactive Hero Section */}
        <section 
          className="bg-gradient-to-tr from-[#000] to-[#0A0A0A] border border-white/5 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden h-[360px] group"
          onMouseMove={handleMouseMove}
        >
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  500px circle at ${mouseX}px ${mouseY}px,
                  rgba(168, 85, 247, 0.15),
                  transparent 80%
                )
              `,
            }}
          />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none" />
          
          <motion.div
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
            className="relative z-10 flex flex-col items-start"
          >
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold tracking-widest rounded-full uppercase">
              Now accepting new projects
            </motion.div>
            
            <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-5xl font-extrabold mt-4 leading-[1.1] tracking-tight">
              We Build Websites That <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 underline decoration-blue-500/30">Grow Your Business</span>
            </motion.h1>
            
            <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-gray-400 mt-4 max-w-sm text-sm leading-relaxed">
              Ship your startup idea faster with our elite team. High-performance apps built for technical founders.
            </motion.p>
            
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex gap-4 mt-8">
              <Link to="/community">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition">
                  Start Project
                </button>
              </Link>
              <Link to="/community">
                <button className="border border-white/10 hover:bg-white/5 px-6 py-3 rounded-xl text-sm font-bold text-gray-300 transition">
                  Browse Community
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Services / Feature Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { tag: "01", title: "Web Development", desc: "React, Next.js, built for scale.", icon: Code2, cBorder: "hover:border-purple-500/30", cIcon: "bg-purple-500/10 text-purple-400" },
            { tag: "02", title: "UI/UX Strategy", desc: "Data-driven interfaces.", icon: LayoutIcon, cBorder: "hover:border-blue-500/30", cIcon: "bg-blue-500/10 text-blue-400" },
            { tag: "03", title: "App Maintenance", desc: "24/7 monitoring and updates.", icon: Rocket, cBorder: "hover:border-green-500/30", cIcon: "bg-green-500/10 text-green-400" }
          ].map((s, i) => (
             <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl group transition-all ${s.cBorder}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.cIcon}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm tracking-tight">{s.title}</h3>
              <p className="text-xs text-gray-500 mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="col-span-5 flex flex-col gap-4">
        {/* Right column - Community Requests */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl flex-1 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Community Requests</h2>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] text-gray-400 font-medium">Live Feed</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 overflow-hidden mb-4 flex-1">
             {requests.length > 0 ? (
               requests.map((r, i) => (
                  <div key={r.id} className={`p-3 bg-white/5 border border-white/5 rounded-xl`}>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold tracking-tight">{r.name}</h4>
                      <span className="text-green-400 text-[10px] font-mono">{r.budget}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{r.idea}</p>
                  </div>
               ))
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 py-8">
                 <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-3">
                   <Users className="w-5 h-5 text-gray-500" />
                 </div>
                 <p className="text-xs font-semibold text-gray-400">No requests yet.</p>
                 <p className="text-[10px] text-gray-500 mt-1">Be the first to submit a project.</p>
               </div>
             )}
          </div>
          <Link to="/community" className="mt-auto">
             <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:bg-white/10 transition-colors">
               SUBMIT YOUR PROJECT IDEA
             </button>
          </Link>
        </div>

        {/* Testimonial Box */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold italic leading-tight">"The fastest turnaround we've experienced for a production app."</h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20" />
              <div>
                <p className="text-xs font-bold">Sarah Jenkins</p>
                <p className="text-[10px] opacity-70">CTO @ NexusPay</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 text-white/10 font-bold text-7xl select-none">99+</div>
        </div>

        {/* Quick Quote Widget */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5">
           <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Quote</h3>
           <div className="space-y-2">
             <input type="text" placeholder="Project Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs focus:border-purple-500 outline-none transition" />
             <div className="grid grid-cols-2 gap-2">
               <select className="bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-gray-400 outline-none focus:border-purple-500 transition [&>*]:bg-[#0A0A0A]">
                 <option>Type: SaaS</option>
                 <option>Type: Mobile</option>
                 <option>Type: Landing</option>
               </select>
               <select className="bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-gray-400 outline-none focus:border-purple-500 transition [&>*]:bg-[#0A0A0A]">
                 <option>Budget: Below $100</option>
                 <option>Budget: $100 - $200</option>
                 <option>Budget: $200 - $300</option>
                 <option>Budget: $300 - $500</option>
                 <option>Budget: Above $500</option>
               </select>
             </div>
             <Link to="/community"><button className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-xs mt-1 hover:bg-blue-700 transition">Send Brief</button></Link>
           </div>
        </div>
      </div>
    </div>
  )
}
