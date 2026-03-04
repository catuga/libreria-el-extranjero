import type { Metadata } from "next"
import Image from "next/image"
import BottomNav from "@/components/BottomNav"
import "./globals.css"

export const metadata: Metadata = {
  title: "El Extranjero — Librería",
  description: "Librería independiente en Sevilla",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b border-[#1A1A1A]/10">
          <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <Image
                src="/el-extranjero.png"
                alt="El Extranjero"
                width={32}
                height={32}
                className="object-contain"
              />
              <div className="flex flex-col leading-none">
                <span
                  className="text-lg md:text-xl uppercase"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.02em" }}
                >
                  El Extranjero
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#1A1A1A]/40 mt-0.5 hidden sm:block">
                  Librería · Taller
                </span>
              </div>
            </a>

            {/* Nav desktop — oculto en móvil */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { href: "/catalogo", label: "Catálogo" },
                { href: "/eventos", label: "Eventos" },
                { href: "/contacto", label: "Contacto" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 pb-24 md:pb-0">
          {children}
        </main>

        <footer className="border-t border-[#1A1A1A]/10 mt-16 hidden md:block">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/el-extranjero.png"
                alt="El Extranjero"
                width={24}
                height={24}
                className="object-contain opacity-40"
              />
              <span className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">
                El Extranjero · Sevilla
              </span>
            </div>
            <a
              href="/suscribirse"
              className="text-xs font-semibold tracking-widest uppercase text-[#D94F35] hover:underline"
            >
              Newsletter →
            </a>
          </div>
        </footer>

        <BottomNav />
      </body>
    </html>
  )
}
