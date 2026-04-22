import { CheckCircle2, Layout, MonitorSmartphone, Server, Zap } from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Services() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <div className="bg-gradient-to-tr from-[#111] to-[#0A0A0A] border border-white/5 rounded-2xl p-8 max-w-4xl mx-auto w-full text-center">
        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest rounded-full uppercase">
          Specialized Services
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight mt-4 mb-4">
          Everything for <span className="text-gradient">Startups</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          We don't just write code. We build scalable digital products designed to convert users and grow your business.
        </p>
      </div>

      {/* Feature Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 h-full flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-6">Expertise across the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">complete stack</span></h2>
          <div className="space-y-4">
            {[
              { icon: Layout, title: "Frontend Engineering", desc: "React, Next.js, and Tailwind CSS for lightning-fast, accessible interfaces." },
              { icon: Server, title: "Backend Architecture", desc: "Node.js, Postgres, and scalable cloud infrastructure." },
              { icon: MonitorSmartphone, title: "Responsive Design", desc: "Pixel-perfect implementation across all devices and screen sizes." },
              { icon: Zap, title: "Performance Optimization", desc: "Core Web Vitals, SEO, and load time enhancements." },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 items-start p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="p-2 rounded-lg bg-[#050505] border border-white/10 text-purple-400">
                  <feature.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-100 tracking-tight">{feature.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="flex flex-col gap-6">
          {[
            {
              name: "MVP Starter",
              price: "$100",
              desc: "Perfect for early-stage startups needing a landing page and waitlist. 1 Week Delivery.",
              features: ["7 Days Free Trial", "Landing Page", "Responsive UI", "SEO Setup"],
              popular: false
            },
            {
              name: "Pro Platform",
              price: "$500",
              popular: true,
              desc: "For businesses ready to launch a full web application. 3-4 Weeks.",
              features: ["14 Days Free Trial", "Full Web App (React/Node)", "Auth & DB", "Payment Integration"]
            }
          ].map((plan, i) => (
            <Card key={i} className={`relative flex flex-col ${plan.popular ? 'border-purple-500/30 glow-effect bg-[#0A0A0A]' : 'bg-[#0A0A0A] border-white/5'}`}>
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Popular
                </div>
              )}
              <div className="p-5 flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex-1">
                  <h3 className="font-bold text-sm tracking-tight mb-1">{plan.name}</h3>
                  <div className="text-3xl font-extrabold tracking-tight mb-2">{plan.price}</div>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-sm">{plan.desc}</p>
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Includes</h4>
                  <ul className="space-y-2 text-xs">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${plan.popular ? 'text-purple-400' : 'text-gray-500'}`} />
                        <span className="text-gray-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <Link to="/contact">
                       <Button variant={plan.popular ? 'neon' : 'outline'} className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
