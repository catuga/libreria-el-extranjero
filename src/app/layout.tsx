import type { Metadata } from "next"
import Image from "next/image"
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

        {/* Bottom navigation — solo móvil */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#1A1A1A]/10 md:hidden">
          <div className="flex items-center justify-around h-16">
            {[
              {
                href: "/",
                label: "Inicio",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                    <path d="M9 21V12h6v9" />
                  </svg>
                ),
              },
              {
                href: "/catalogo",
                label: "Catálogo",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                ),
              },
              {
                href: "/eventos",
                label: "Eventos",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
              },
              {
                href: "/contacto",
                label: "Contacto",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
              },
            ].map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-4 py-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
              >
                {icon}
                <span className="text-[10px] tracking-wide uppercase">{label}</span>
              </a>
            ))}
          </div>
        </nav>
      </body>
    </html>
  )
}
