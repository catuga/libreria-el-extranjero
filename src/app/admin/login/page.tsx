"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email o contraseña incorrectos")
      setLoading(false)
    } else {
      router.refresh()
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <Image src="/el-extranjero.png" alt="El Extranjero" width={48} height={48} className="mb-4 opacity-80" />
          <h1
            className="text-2xl uppercase tracking-widest text-[#1A1A1A]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            El Extranjero
          </h1>
          <p className="text-xs tracking-widest uppercase text-[#1A1A1A]/40 mt-1">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#1A1A1A]/10 rounded-lg p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40 bg-white"
            />
          </div>

          {error && (
            <p className="text-sm text-[#E8321A] bg-[#E8321A]/5 border border-[#E8321A]/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-white py-2.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#1A1A1A]/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
