import { prisma } from "@/lib/prisma"
import { enviarNewsletter } from "./actions"

type NewsletterRow = Awaited<ReturnType<typeof prisma.newsletter.findMany>>[number]

export default async function AdminNewsletter() {
  const suscriptoresActivos = await prisma.suscriptor.count({ where: { activo: true } })
  const newsletters: NewsletterRow[] = await prisma.newsletter.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Newsletter
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 mt-1">{suscriptoresActivos} suscriptores activos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de envío */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 mb-4">Nuevo envío</h2>

          <form action={enviarNewsletter} className="bg-white border border-[#1A1A1A]/10 rounded-lg p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
                Asunto *
              </label>
              <input
                name="asunto"
                type="text"
                required
                placeholder="Novedades de marzo en El Extranjero..."
                className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
                Cuerpo del mensaje *
              </label>
              <textarea
                name="cuerpo"
                required
                rows={10}
                placeholder="Hola a todos,&#10;&#10;Este mes en El Extranjero..."
                className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-[#1A1A1A]/40">
                Se enviará a {suscriptoresActivos} suscriptores
              </p>
              <button
                type="submit"
                className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#1A1A1A]/80 transition-colors"
              >
                Enviar newsletter
              </button>
            </div>
          </form>
        </div>

        {/* Historial */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 mb-4">Historial</h2>

          <div className="space-y-3">
            {newsletters.length === 0 ? (
              <div className="bg-white border border-[#1A1A1A]/10 rounded-lg p-6 text-center">
                <p className="text-sm text-[#1A1A1A]/30">Sin envíos todavía</p>
              </div>
            ) : (
              newsletters.map((n) => (
                <div key={n.id} className="bg-white border border-[#1A1A1A]/10 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">{n.asunto}</p>
                      <p className="text-xs text-[#1A1A1A]/40 mt-1">
                        {n.createdAt.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded shrink-0 ${
                        n.enviadoAt
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {n.enviadoAt ? "Enviado" : "Borrador"}
                    </span>
                  </div>
                  {n.cuerpo && (
                    <p className="text-xs text-[#1A1A1A]/40 mt-2 line-clamp-2">{n.cuerpo}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
