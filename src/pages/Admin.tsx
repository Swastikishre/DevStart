import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { ShieldAlert, Users, Mail, CheckCircle2, Search, Filter } from "lucide-react"

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'requests' | 'contacts'>('requests')
  
  const [requests, setRequests] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setIsLoading(false)
    })
    return () => unsubscribeAuth()
  }, [])

  useEffect(() => {
    if (!user) return

    // Since we only allow specific emails in rules, if it fails to read, they just show empty.
    // Realistically we can just try setting up listeners.
    const qReqs = query(collection(db, "requests"), orderBy("createdAt", "desc"))
    const unsubReqs = onSnapshot(qReqs, async (snapshot) => {
      const basicReqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      
      // Fetch private emails
      const reqsWithEmails = await Promise.all(basicReqs.map(async (r: any) => {
        try {
          const privateSnap = await getDoc(doc(db, "requests", r.id, "private", "contact"))
          if (privateSnap.exists()) {
            r.email = privateSnap.data().email
          }
        } catch (e) {
          // ignore if permission denied
        }
        return r
      }))
      
      setRequests(reqsWithEmails)
    }, (err) => console.log("Req auth err", err))

    const qContacts = query(collection(db, "contacts"), orderBy("createdAt", "desc"))
    const unsubContacts = onSnapshot(qContacts, (snapshot) => {
      setContacts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    }, (err) => console.log("Contact auth err", err))

    return () => {
      unsubReqs()
      unsubContacts()
    }
  }, [user])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "requests", id), { status: newStatus })
    } catch (err) {
      console.error(err)
      alert("Failed to update status")
    }
  }

  const formatTime = (ts: any) => {
    if (!ts) return ''
    return new Date(ts.toDate()).toLocaleString()
  }

  const isAdmin = user && (user.email === 'rasalswastik09@gmail.com' || user.email === 'misaldhananjay26@gmail.com')

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading admin checking...</div>
  }

  if (!isAdmin) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400">You do not have permission to view this page.</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Dashboard</span></h1>
          <p className="text-sm text-gray-400 mt-1">Manage project requests and contact messages.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveTab('requests')} 
             className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'requests' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
           >
             Community Requests
           </button>
           <button 
             onClick={() => setActiveTab('contacts')} 
             className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'contacts' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
           >
             Contact Messages
           </button>
        </div>
      </div>

      {activeTab === 'requests' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 px-2 flex items-center gap-2">
            <Users className="w-4 h-4" /> Live Community Requests ({requests.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
             {requests.map(req => (
               <div key={req.id} className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl flex flex-col gap-3 group hover:border-white/10 transition-colors relative">
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-bold text-gray-100">{req.name}</h3>
                     <p className="text-[10px] text-gray-400 font-mono mt-0.5">{req.email || "Email hidden"}</p>
                   </div>
                   <select 
                     className={`text-[10px] font-bold px-2 py-1 rounded outline-none border transition-colors ${
                       req.status === 'Completed' ? 'bg-white/5 border-white/10 text-gray-400' :
                       req.status === 'Accepted' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                       'bg-orange-500/10 border-orange-500/20 text-orange-400'
                     }`}
                     value={req.status}
                     onChange={(e) => handleStatusChange(req.id, e.target.value)}
                   >
                     <option className="bg-[#0A0A0A] text-white" value="In Review">In Review</option>
                     <option className="bg-[#0A0A0A] text-white" value="Accepted">Accepted</option>
                     <option className="bg-[#0A0A0A] text-white" value="Completed">Completed</option>
                   </select>
                 </div>
                 <div className="text-xs text-gray-400 bg-white/5 p-3 rounded-xl min-h-[80px]">
                   "{req.idea}"
                 </div>
                 <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/5">
                   <p className="text-[10px] text-gray-500">{formatTime(req.createdAt)}</p>
                   <p className="text-[10px] font-mono text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded">{req.budget}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 px-2 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Received Messages ({contacts.length})
          </h2>
          <div className="flex flex-col gap-3">
             {contacts.map(msg => (
               <div key={msg.id} className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row gap-4 justify-between group hover:border-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="font-bold text-gray-100">{msg.name}</h3>
                       <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 font-mono border border-white/10">{msg.type}</span>
                    </div>
                    <a href={`mailto:${msg.email}`} className="text-xs text-purple-400 hover:underline inline-flex items-center gap-1 mb-3">
                      {msg.email}
                    </a>
                    <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5">
                      {msg.message}
                    </div>
                  </div>
                  <div className="md:w-48 flex flex-col items-end md:justify-between text-right border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4">
                     <p className="text-[10px] text-gray-500">{formatTime(msg.createdAt)}</p>
                     <div className="mt-4 md:mt-0">
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Budget</p>
                       <p className="text-xs font-bold text-gray-300">{msg.budget}</p>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  )
}
