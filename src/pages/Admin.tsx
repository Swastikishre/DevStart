import { useState, useEffect, useMemo, FormEvent } from "react"
import { motion, AnimatePresence } from "motion/react"
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { ShieldAlert, Users, Mail, CheckCircle2, Search, Filter, BarChart3, Trash2, Plus } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true)
  const [hasAdminAccess, setHasAdminAccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'requests' | 'contacts' | 'admins'>('requests')
  
  const [requests, setRequests] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [dynamicAdmins, setDynamicAdmins] = useState<any[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setIsLoading(false)
      
      if (u && u.email) {
        // Double check admin status: Hardcoded OR Firestore
        const hardcoded = ['rasalswastik09@gmail.com', 'misaldhananjay26@gmail.com'].includes(u.email)
        if (hardcoded) {
          setHasAdminAccess(true)
          setIsCheckingAdmin(false)
        } else {
          try {
            const adminDoc = await getDoc(doc(db, "admins", u.email))
            setHasAdminAccess(adminDoc.exists())
          } catch (e) {
            setHasAdminAccess(false)
          } finally {
            setIsCheckingAdmin(false)
          }
        }
      } else {
        setHasAdminAccess(false)
        setIsCheckingAdmin(false)
      }
    })
    return () => unsubscribeAuth()
  }, [])

  useEffect(() => {
    if (!user || !hasAdminAccess) return

    const qReqs = query(collection(db, "requests"), orderBy("createdAt", "desc"))
    const unsubReqs = onSnapshot(qReqs, async (snapshot) => {
      const basicReqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      
      const reqsWithEmails = await Promise.all(basicReqs.map(async (r: any) => {
        try {
          const privateSnap = await getDoc(doc(db, "requests", r.id, "private", "contact"))
          if (privateSnap.exists()) {
            r.email = privateSnap.data().email
          }
        } catch (e) {
          // ignore
        }
        return r
      }))
      
      setRequests(reqsWithEmails)
    }, (err) => console.log("Req auth err", err))

    const qContacts = query(collection(db, "contacts"), orderBy("createdAt", "desc"))
    const unsubContacts = onSnapshot(qContacts, (snapshot) => {
      setContacts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    }, (err) => console.log("Contact auth err", err))

    const qAdmins = query(collection(db, "admins"))
    const unsubAdmins = onSnapshot(qAdmins, (snapshot) => {
      setDynamicAdmins(snapshot.docs.map(d => ({ email: d.id, ...d.data() })))
    })

    return () => {
      unsubReqs()
      unsubContacts()
      unsubAdmins()
    }
  }, [user, hasAdminAccess])

  const handleAddAdmin = async (e: FormEvent) => {
    e.preventDefault()
    if (!newAdminEmail.trim()) return
    setIsAddingAdmin(true)
    try {
      await setDoc(doc(db, "admins", newAdminEmail.toLowerCase().trim()), {
        addedAt: serverTimestamp(),
        addedBy: user?.email
      })
      setNewAdminEmail("")
      alert("Admin added successfully!")
    } catch (err: any) {
      alert("Failed to add admin: " + err.message)
    } finally {
      setIsAddingAdmin(false)
    }
  }

  const handleRemoveAdmin = async (email: string) => {
    if (['rasalswastik09@gmail.com', 'misaldhananjay26@gmail.com'].includes(email)) {
      alert("Cannot remove root administrators.")
      return
    }
    if (!window.confirm(`Are you sure you want to remove ${email} from admins?`)) return
    try {
      await deleteDoc(doc(db, "admins", email))
    } catch (err: any) {
      alert("Failed to remove admin: " + err.message)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "requests", id), { status: newStatus })
    } catch (err) {
      console.error(err)
      alert("Failed to update status")
    }
  }

  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project request?")) return
    try {
      await deleteDoc(doc(db, "requests", id))
    } catch (err) {
      console.error(err)
      alert("Failed to delete request")
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return
    try {
      await deleteDoc(doc(db, "contacts", id))
    } catch (err) {
      console.error(err)
      alert("Failed to delete contact")
    }
  }

  const formatTime = (ts: any) => {
    if (!ts) return ''
    return new Date(ts.toDate()).toLocaleString()
  }

  const chartData = useMemo(() => {
    // Generate simple time-series data for the last 7 days of requests
    const dataMap: Record<string, number> = {}
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      dataMap[d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })] = 0
    }

    requests.forEach(req => {
      if (!req.createdAt) return
      const dateStr = new Date(req.createdAt.toDate()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      if (dataMap[dateStr] !== undefined) {
        dataMap[dateStr] += 1
      }
    })

    return Object.keys(dataMap).map(date => ({
      date,
      Requests: dataMap[date]
    }))
  }, [requests])

  if (isLoading || isCheckingAdmin) {
    return <div className="p-8 text-center text-gray-500">Loading admin panel...</div>
  }

  if (!hasAdminAccess) {
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
           <button 
             onClick={() => setActiveTab('admins')} 
             className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'admins' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
           >
             Manage Admins
           </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl flex flex-col h-[300px]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 px-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Incoming Requests (7 Days)
          </h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#A855F7', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Requests" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="md:col-span-4 bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                <h3 className="text-3xl font-black text-purple-400 mb-1 tracking-tighter">{requests.length}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Reqs</p>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                <h3 className="text-3xl font-black text-blue-400 mb-1 tracking-tighter">{requests.filter(r => r.status === 'In Review').length}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pending</p>
             </div>
             <div className="col-span-2 bg-gradient-to-tr from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-4 text-center">
                <h3 className="text-3xl font-black text-green-400 mb-1 tracking-tighter">{requests.filter(r => r.status === 'Completed').length}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Completed Projects</p>
             </div>
          </div>
        </div>
      </div>

      {activeTab === 'requests' && (
        <div className="flex flex-col gap-4 mt-2">
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
                   <div className="flex items-center gap-4">
                     <p className="text-[10px] text-gray-500">{formatTime(req.createdAt)}</p>
                     <button 
                       onClick={() => handleDeleteRequest(req.id)}
                       className="text-gray-500 hover:text-red-500 transition-colors"
                       title="Delete request"
                     >
                       <Trash2 className="w-3 h-3" />
                     </button>
                   </div>
                   <p className="text-[10px] font-mono text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded">{req.budget}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="flex flex-col gap-6 mt-2 max-w-2xl">
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Administrator
            </h2>
            <form onSubmit={handleAddAdmin} className="flex gap-2">
              <input 
                type="email" 
                placeholder="gmail@example.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 transition"
                required
              />
              <button 
                type="submit" 
                disabled={isAddingAdmin}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl text-sm transition disabled:opacity-50"
              >
                {isAddingAdmin ? 'Adding...' : 'Add Admin'}
              </button>
            </form>
            <p className="text-[10px] text-gray-500 mt-3">Admins will have full access to manage requests and other admins.</p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Existing Administrators
            </h2>
            <div className="space-y-3">
               {/* Root Admins */}
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-purple-500/20">
                 <div>
                   <p className="text-xs font-bold text-gray-100">rasalswastik09@gmail.com</p>
                   <p className="text-[9px] text-purple-400 uppercase font-bold tracking-tighter">Root Admin</p>
                 </div>
                 <BarChart3 className="w-4 h-4 text-purple-500 opacity-50" />
               </div>
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-purple-500/20">
                 <div>
                   <p className="text-xs font-bold text-gray-100">misaldhananjay26@gmail.com</p>
                   <p className="text-[9px] text-purple-400 uppercase font-bold tracking-tighter">Root Admin</p>
                 </div>
                 <BarChart3 className="w-4 h-4 text-purple-500 opacity-50" />
               </div>

               {/* Dynamic Admins */}
               {dynamicAdmins.map(adm => (
                 <div key={adm.email} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                   <div>
                     <p className="text-xs font-bold text-gray-100">{adm.email}</p>
                     <p className="text-[9px] text-gray-500">Added on {adm.addedAt ? new Date(adm.addedAt.toDate()).toLocaleDateString() : 'N/A'}</p>
                   </div>
                   <button 
                     onClick={() => handleRemoveAdmin(adm.email)}
                     className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
