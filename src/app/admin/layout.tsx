import { auth } from "@/lib/auth"
import Link from "next/link"
import { signOut } from "@/lib/auth"

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/libros", label: "Libros" },
  { href: "/admin/slider", label: "Slider" },
  { href: "/admin/eventos", label: "Eventos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/pedidos", label: "Pedidos" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Login page — no sidebar, just render children
  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 bg-[#1A1A1A] text-white flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-xs tracking-widest uppercase text-white/40 mb-0.5">Panel admin</p>
          <p className="text-sm font-semibold text-white">El Extranjero</p>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-6 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-white/30 mb-3 truncate">{session.user?.email}</p>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/admin/login" })
            }}
          >
            <button
              type="submit"
              className="text-xs tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-[#F9F9F7] min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}
