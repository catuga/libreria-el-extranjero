import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

async function suscribirse(formData: FormData) {
  "use server"

  const email = formData.get("email") as string
  const nombre = formData.get("nombre") as string

  // Upsert: si ya existe, reactivamos
  await prisma.suscriptor.upsert({
    where: { email },
    update: { activo: true, nombre: nombre || null },
    create: { email, nombre: nombre || null, activo: true },
  })

  redirect("/suscribirse?ok=1")
}

interface Props {
  searchParams: Promise<{ ok?: string }>
}

export default async function SuscribirsePage({ searchParams }: Props) {
  const { ok } = await searchParams

  return (
    <div className="max-w-lg mx-auto py-16">
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#D94F35] mb-3">Newsletter</p>
        <h1
          className="text-4xl uppercase tracking-wide text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Únete a nuestra lista
        </h1>
        <p className="text-[#1A1A1A]/60 leading-relaxed">
          Novedades del catálogo, eventos, lecturas recomendadas y todo lo que pasa en El Extranjero.
          Sin spam, con cariño.
        </p>
      </div>

      {ok ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <p className="text-green-800 font-semibold text-lg mb-2">¡Ya estás dentro!</p>
          <p className="text-green-700 text-sm">Pronto recibirás noticias de El Extranjero.</p>
        </div>
      ) : (
        <form action={suscribirse} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Nombre (opcional)
            </label>
            <input
              name="nombre"
              type="text"
              className="w-full border border-[#1A1A1A]/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#1A1A1A]/50 bg-white"
              placeholder="Tu nombre..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Email *
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-[#1A1A1A]/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#1A1A1A]/50 bg-white"
              placeholder="tu@email.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#D94F35] text-white py-3 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#D94F35]/80 transition-colors"
          >
            Suscribirme
          </button>

          <p className="text-xs text-center text-[#1A1A1A]/30">
            Puedes darte de baja cuando quieras. Sin spam.
          </p>
        </form>
      )}
    </div>
  )
}
