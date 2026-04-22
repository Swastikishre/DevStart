import Navbar from "./Navbar"
import Footer from "./Footer"
import SocialWidgets from "./SocialWidgets"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-gray-100 selection:bg-purple-500 selection:text-white font-sans items-center">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl pt-14 pb-14">
        <Outlet />
      </main>
      <Footer />
      <SocialWidgets />
    </div>
  )
}
