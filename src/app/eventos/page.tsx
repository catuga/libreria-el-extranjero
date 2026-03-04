import { prisma } from "@/lib/prisma"
import Image from "next/image"

export default async function EventosPage() {
  const eventos = await prisma.evento.findMany({
    where: { activo: true },
    orderBy: { fecha: "asc" },
  })

  const ahora = new Date()
  const proximos = eventos.filter((e) => e.fecha >= ahora)
  const pasados = eventos.filter((e) => e.fecha < ahora)

  return (
    <div className="py-6 md:py-10">
      <div className="mb-8 md:mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#D94F35] mb-3">Agenda</p>
        <h1
          className="text-2xl md:text-4xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Eventos
        </h1>
      </div>

      {eventos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#1A1A1A]/30 mb-2">Próximamente</p>
          <p className="text-sm text-[#1A1A1A]/20">Estamos preparando algo. Vuelve pronto.</p>
        </div>
      ) : (
        <>
          {proximos.length > 0 && (
            <section className="mb-16">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 mb-6">
                Próximos eventos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {proximos.map((evento) => (
                  <article key={evento.id} className="border border-[#1A1A1A]/10 rounded-lg overflow-hidden">
                    {evento.imagen ? (
                      <div className="relative h-48">
                        <Image src={evento.imagen} alt={evento.titulo} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-24 bg-[#1A1A1A]/5 flex items-center justify-center">
                        <span className="text-[#1A1A1A]/15 text-4xl">◎</span>
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-xs font-semibold tracking-widest uppercase text-[#D94F35] mb-2">
                        {evento.fecha.toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                        {" — "}
                        {evento.fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}h
                      </p>
                      <h3
                        className="text-lg uppercase tracking-wide text-[#1A1A1A] mb-2"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {evento.titulo}
                      </h3>
                      {evento.descripcion && (
                        <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">{evento.descripcion}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {pasados.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/30 mb-6">
                Eventos pasados
              </h2>
              <div className="space-y-3">
                {pasados.reverse().map((evento) => (
                  <div key={evento.id} className="flex items-center gap-4 py-3 border-b border-[#1A1A1A]/5 opacity-50">
                    <p className="text-xs text-[#1A1A1A]/40 w-32 shrink-0">
                      {evento.fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-sm text-[#1A1A1A]">{evento.titulo}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
