import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { MessageSquare, Plus, Clock, CheckCircle2, Users, ArrowUpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, where, Timestamp, getDocs, updateDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function Community() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, setUser)
    
    const twentyFourHoursAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000))

    const q = query(collection(db, "requests"), where("createdAt", ">=", twentyFourHoursAgo), orderBy("createdAt", "desc"))
    const unsubscribeDocs = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })

    return () => {
      unsubscribeAuth()
      unsubscribeDocs()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Please login first to submit a request.")
      return
    }

    setIsSubmitting(true)
    const target = e.target as any

    try {
      // Rate Limit Check
      const twentyFourHoursAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000))
      const userReqsQ = query(collection(db, "requests"), where("userId", "==", user.uid), where("createdAt", ">=", twentyFourHoursAgo))
      const userReqsSnap = await getDocs(userReqsQ)
      
      if (userReqsSnap.size >= 2) {
        alert("You have reached the limit of 2 submissions per 24 hours. Please wait before submitting another project.")
        setIsSubmitting(false)
        return
      }

      // 1. Add public request
      const docRef = await addDoc(collection(db, "requests"), {
        name: target.name.value,
        idea: target.idea.value,
        budget: target.budget.value,
        status: "In Review",
        userId: user.uid,
        upvotes: [],
        createdAt: serverTimestamp()
      })

      // 2. Add private PII info
      await setDoc(doc(db, "requests", docRef.id, "private", "contact"), {
        email: target.email.value
      })

      target.reset()
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (err: any) {
      console.error(err)
      alert("Failed to post request: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpvote = async (requestId: string, currentUpvotes: string[]) => {
    if (!user) {
      alert("Please login to upvote")
      return
    }
    
    // Prevent double voting or self voting (optional, but good practice)
    if (currentUpvotes.includes(user.uid)) return

    try {
      await updateDoc(doc(db, "requests", requestId), {
        upvotes: [...currentUpvotes, user.uid]
      })
    } catch (err) {
      console.error(err)
    }
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Just now'
    return new Date(timestamp.toDate()).toLocaleDateString()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:grid grid-cols-12 gap-4">
      <div className="col-span-12 mb-2">
        <h1 className="text-2xl font-extrabold tracking-tight">Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Requests</span></h1>
        <p className="text-xs text-gray-400 mt-1">Post your project idea and get an estimate from our team.</p>
      </div>

      <div className="col-span-7">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Submit Your Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!user ? (
               <div className="py-12 flex flex-col items-center justify-center text-center opacity-70">
                 <p className="text-sm text-gray-400 mb-2">You must be logged in to submit a request.</p>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name / Company</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" defaultValue={user?.email || ''} required />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="idea">Project Description</Label>
                  <Textarea 
                    id="idea" 
                    placeholder="Briefly describe what you want to build..." 
                    className="h-24"
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="budget">Budget Range</Label>
                  <select 
                    id="budget" 
                    defaultValue=""
                    className="flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-gray-300 focus-visible:outline-none focus:border-purple-500 transition-colors [&>*]:bg-[#0A0A0A]"
                    required
                  >
                    <option value="" disabled>Select a range</option>
                    <option value="< $2k">Under $2,000</option>
                    <option value="$2k - $5k">$2,000 - $5,000</option>
                    <option value="$5k - $10k">$5,000 - $10,000</option>
                    <option value="$10k+">$10,000+</option>
                  </select>
                </div>
                <Button type="submit" variant="neon" className="w-full mt-2" isLoading={isSubmitting}>
                  Submit For Review
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="col-span-5 h-full">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">Live Feed (Last 24h)</CardTitle>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] text-gray-400">Online</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {requests.length > 0 ? (
              requests.map((req) => (
                <div key={req.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex gap-3">
                  <div className="flex flex-col items-center justify-start pt-1">
                    <button 
                      onClick={() => handleUpvote(req.id, req.upvotes || [])}
                      className={`transition-colors ${user && (req.upvotes || []).includes(user.uid) ? 'text-purple-400' : 'text-gray-500 hover:text-purple-300'}`}
                    >
                      <ArrowUpCircle className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-bold mt-1 text-gray-300">{(req.upvotes || []).length}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-gray-100">{req.name}</h4>
                      <span className="text-green-400 text-[10px] font-mono font-bold tracking-tight">{req.budget}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed mb-4">"{req.idea}"</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[9px] text-gray-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {formatTime(req.createdAt)}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
                        req.status === 'Completed' ? 'bg-white/10 text-gray-400' :
                        req.status === 'Accepted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 py-12">
                 <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-3">
                   <Users className="w-5 h-5 text-gray-500" />
                 </div>
                 <p className="text-sm font-semibold text-gray-400">No requests yet.</p>
                 <p className="text-xs text-gray-500 mt-1">Be the first to submit a project idea.</p>
              </div>
            )}
          </CardContent>
        </Card>
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
              <p className="text-sm font-bold text-gray-100">Request Submitted!</p>
              <p className="text-[10px] text-gray-400 mt-0.5">We'll get back to you within 24 hours.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
