import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Code2, Menu, X, LogIn, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { auth, provider } from "@/lib/firebase"
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        console.error(error)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
  }

  const isAdmin = user && (user.email === 'rasalswastik09@gmail.com' || user.email === 'misaldhananjay26@gmail.com')

  const links = [
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Community", href: "/community" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]
  
  if (isAdmin) {
    links.push({ name: "Admin", href: "/admin" })
  }

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-[#0A0A0A]/80 backdrop-blur-md border-white/10"
          : "bg-transparent py-2"
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
              DevStart
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-purple-400",
                  location.pathname === link.href ? "text-purple-400" : "text-gray-400"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex flex-row items-center gap-4">
          <div className="flex gap-2 items-center mr-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Developers Online: 2</span>
          </div>
          {user ? (
            <div className="relative group cursor-pointer hover:bg-white/5 transition-colors p-2 rounded-xl flex items-center gap-2">
               <User className="h-4 w-4 text-purple-400" />
               <span className="text-[10px] font-bold text-gray-300 tracking-tight">{user.email}</span>
               <div onClick={handleLogout} className="absolute right-0 top-full mt-2 w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-2 hidden group-hover:flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                  <LogOut className="h-3 w-3 text-red-500" />
                  <span className="text-[10px] font-bold text-gray-300">Logout</span>
               </div>
            </div>
          ) : (
            <button onClick={handleLogin} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
              <LogIn className="h-3 w-3" /> Login
            </button>
          )}
        </div>

        <button
          className="md:hidden text-gray-400 hover:text-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#0A0A0A] border-b border-white/10 p-4 md:hidden flex flex-col gap-4 shadow-xl"
          >
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "block px-4 py-2 text-sm font-bold rounded-lg transition-colors",
                  location.pathname === link.href
                    ? "bg-white/5 text-purple-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-100"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex gap-2 items-center px-4 mb-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Developers Online: 2</span>
              </div>
              {user ? (
                 <>
                   <div className="px-4 py-2 text-[10px] font-bold text-gray-300 border-b border-white/5 pb-4">
                     Logged in as: <span className="text-purple-400 ml-1">{user.email}</span>
                   </div>
                   <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-500 px-4 py-3 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                     <LogOut className="h-4 w-4" /> Logout
                   </button>
                 </>
              ) : (
                <button onClick={handleLogin} className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" /> Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
