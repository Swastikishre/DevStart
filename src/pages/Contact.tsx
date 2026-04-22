import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Mail, MapPin, MessageCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const target = e.target as any
    
    try {
      await addDoc(collection(db, "contacts"), {
        name: `${target.firstName.value} ${target.lastName.value}`.trim(),
        email: target.email.value,
        type: target.company.value || "Individual",
        budget: "Not specified", // From other form, just default string here to match schema
        message: target.message.value,
        createdAt: serverTimestamp()
      })
      
      target.reset()
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error(error)
      alert("Failed to send message.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-6 h-full">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 flex-1 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px]" />
             <div className="relative z-10">
               <h1 className="text-3xl font-extrabold tracking-tight mb-4">
                 Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Touch</span>
               </h1>
               <p className="text-xs text-gray-400 mb-8 max-w-md leading-relaxed">
                 Whether you need a full web application or just a landing page to test your idea, we're here to help. Reach out and we'll reply within 24 hours.
               </p>

               <div className="space-y-6">
                 <div className="flex items-start gap-3">
                   <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-purple-400 mt-1">
                     <Mail className="w-4 h-4" />
                   </div>
                   <div>
                     <h3 className="font-bold text-sm tracking-tight text-gray-100">Emails</h3>
                     <p className="text-gray-400 text-xs mt-1">rasalswastik09@gmail.com</p>
                     <p className="text-gray-400 text-xs mt-0.5">misaldhananjay26@gmail.com</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-blue-400 mt-1">
                     <MessageCircle className="w-4 h-4" />
                   </div>
                   <div>
                     <h3 className="font-bold text-sm tracking-tight text-gray-100">WhatsApp</h3>
                     <p className="text-gray-400 text-xs mt-1">+91 9307110757</p>
                     <Button variant="outline" size="sm" className="mt-2 text-[10px]">
                       Chat on WhatsApp
                     </Button>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <div>
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="company">Company / Startup Name</Label>
                  <Input id="company" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="message">How can we help?</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your project, timeline, and budget..." 
                    className="h-24"
                    required 
                  />
                </div>
                <Button type="submit" variant="neon" className="w-full mt-2" isLoading={isSubmitting}>
                  Send Message
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex items-center gap-3 z-50 shadow-xl"
          >
            <CheckCircle2 className="text-green-500 w-5 h-5" />
            <div>
              <p className="text-sm font-bold text-gray-100">Message Sent!</p>
              <p className="text-[10px] text-gray-400 mt-0.5">We'll be in touch shortly.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
