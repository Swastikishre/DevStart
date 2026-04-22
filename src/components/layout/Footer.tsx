import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="h-10 bg-[#0A0A0A] border-t border-white/5 px-6 flex items-center justify-between text-[10px] text-gray-500 max-w-6xl mx-auto w-full">
      <div className="flex gap-4">
        <span>&copy; {new Date().getFullYear()} StackBuild Lab</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> 98% Client Satisfaction
        </span>
      </div>
      <div className="flex gap-4">
        <Link to="/about" className="hover:text-white transition-colors">Terms</Link>
        <Link to="/about" className="hover:text-white transition-colors">Privacy</Link>
        <a href="#" className="hover:text-white transition-colors">Twitter</a>
        <Link to="/contact" className="hover:text-white font-bold text-green-500">Hire Us Now</Link>
      </div>
    </footer>
  )
}
