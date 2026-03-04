import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

type SuscriptorRow = Prisma.SuscriptorGetPayload<Record<string, never>>
type ClienteRow = Prisma.ClienteGetPayload<{
  include: { _count: { select: { pedidos: true } } }
}>

export default async function AdminClientes() {
  const clientes: ClienteRow[] = await prisma.cliente.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { pedidos: true } } },
  })
  const suscriptores: SuscriptorRow[] = await prisma.suscriptor.findMany({
    orderBy: { createdAt: "desc" },
  })

  const suscriptoresActivos = suscriptores.filter((s) => s.activo).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Clientes
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 mt-1">
          {clientes.length} clientes · {suscriptores.length} suscriptores newsletter
        </p>
      </div>

      {/* Suscriptores newsletter */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 mb-4">
          Suscriptores al newsletter ({suscriptoresActivos} activos)
        </h2>

        <div className="bg-white border border-[#1A1A1A]/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1A1A1A]/10 bg-[#F9F9F7]">
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 hidden sm:table-cell">Nombre</th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">Estado</th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 hidden md:table-cell">Alta</th>
              </tr>
            </thead>
            <tbody>
              {suscriptores.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-sm text-[#1A1A1A]/30">
                    Sin suscriptores todavía
                  </td>
                </tr>
              ) : (
                suscriptores.map((s) => (
                  <tr key={s.id} className={`border-b border-[#1A1A1A]/5 last:border-0 ${!s.activo ? "opacity-40" : ""}`}>
                    <td className="px-5 py-3 font-medium">{s.email}</td>
                    <td className="px-5 py-3 text-[#1A1A1A]/60 hidden sm:table-cell">{s.nombre || "—"}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${
                          s.activo ? "bg-green-50 text-green-700" : "bg-[#1A1A1A]/5 text-[#1A1A1A]/40"
                        }`}
                      >
                        {s.activo ? "Activo" : "Baja"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#1A1A1A]/40 text-xs hidden md:table-cell">
                      {s.createdAt.toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Clientes */}
      <section>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 mb-4">
          Clientes con pedidos ({clientes.length})
        </h2>

        <div className="bg-white border border-[#1A1A1A]/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1A1A1A]/10 bg-[#F9F9F7]">
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">Nombre</th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">Email</th>
                <th className="text-right px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 hidden sm:table-cell">Pedidos</th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 hidden md:table-cell">Alta</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-sm text-[#1A1A1A]/30">
                    Sin clientes todavía
                  </td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id} className="border-b border-[#1A1A1A]/5 last:border-0">
                    <td className="px-5 py-3 font-medium">{c.nombre}</td>
                    <td className="px-5 py-3 text-[#1A1A1A]/60">{c.email}</td>
                    <td className="px-5 py-3 text-right text-[#1A1A1A]/60 hidden sm:table-cell">{c._count.pedidos}</td>
                    <td className="px-5 py-3 text-[#1A1A1A]/40 text-xs hidden md:table-cell">
                      {c.createdAt.toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
