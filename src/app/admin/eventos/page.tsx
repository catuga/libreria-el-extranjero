import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { archivarEvento } from "./actions"
import Image from "next/image"

type EventoRow = Prisma.EventoGetPayload<Record<string, never>>

export default async function AdminEventos() {
  const eventos: EventoRow[] = await prisma.evento.findMany({
    orderBy: { fecha: "asc" },
  })

  const activos = eventos.filter((e) => e.activo)
  const archivados = eventos.filter((e) => !e.activo)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Eventos
          </h1>
          <p className="text-sm text-[#1A1A1A]/40 mt-1">{activos.length} activos</p>
        </div>
        <Link
          href="/admin/eventos/nuevo"
          className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#1A1A1A]/80 transition-colors"
        >
          + Nuevo evento
        </Link>
      </div>

      {eventos.length === 0 ? (
        <div className="bg-white border border-[#1A1A1A]/10 rounded-lg p-12 text-center">
          <p className="text-sm text-[#1A1A1A]/30 mb-4">Sin eventos todavía</p>
          <Link
            href="/admin/eventos/nuevo"
            className="text-xs font-semibold tracking-widest uppercase text-[#D94F35] hover:underline"
          >
            Crear primer evento →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {activos.map((evento) => (
              <div key={evento.id} className="bg-white border border-[#1A1A1A]/10 rounded-lg overflow-hidden">
                {evento.imagen && (
                  <div className="relative h-40">
                    <Image src={evento.imagen} alt={evento.titulo} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#D94F35] mb-1">
                    {evento.fecha.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">{evento.titulo}</h3>
                  {evento.descripcion && (
                    <p className="text-xs text-[#1A1A1A]/50 line-clamp-2 mb-3">{evento.descripcion}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/eventos/${evento.id}/editar`}
                      className="text-xs text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
                    >
                      Editar
                    </Link>
                    <form
                      action={async () => {
                        "use server"
                        await archivarEvento(evento.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs text-[#1A1A1A]/30 hover:text-[#D94F35] transition-colors"
                      >
                        Archivar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {archivados.length > 0 && (
            <details className="bg-white border border-[#1A1A1A]/10 rounded-lg overflow-hidden">
              <summary className="px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 cursor-pointer hover:text-[#1A1A1A]/60">
                Archivados ({archivados.length})
              </summary>
              <div className="border-t border-[#1A1A1A]/10 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {archivados.map((evento) => (
                  <div key={evento.id} className="text-sm opacity-50 p-3 border border-[#1A1A1A]/5 rounded">
                    <p className="font-medium">{evento.titulo}</p>
                    <p className="text-xs text-[#1A1A1A]/40">
                      {evento.fecha.toLocaleDateString("es-ES")}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </>
      )}
    </div>
  )
}
