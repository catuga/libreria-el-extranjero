import { prisma } from "@/lib/prisma"
import { EstadoPedido } from "@prisma/client"
import { actualizarEstadoPedido } from "./actions"

const estadoColores: Record<EstadoPedido, string> = {
  PENDIENTE: "bg-yellow-50 text-yellow-700",
  CONFIRMADO: "bg-blue-50 text-blue-700",
  PREPARANDO: "bg-purple-50 text-purple-700",
  LISTO: "bg-orange-50 text-orange-700",
  ENTREGADO: "bg-green-50 text-green-700",
  CANCELADO: "bg-red-50 text-red-700",
}

const estadoSiguiente: Partial<Record<EstadoPedido, EstadoPedido>> = {
  PENDIENTE: "CONFIRMADO",
  CONFIRMADO: "PREPARANDO",
  PREPARANDO: "LISTO",
  LISTO: "ENTREGADO",
}

export default async function AdminPedidos() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      cliente: { select: { nombre: true, email: true } },
      items: {
        include: { libro: { select: { titulo: true } } },
      },
    },
  })

  const pendientes = pedidos.filter((p) => p.estado === "PENDIENTE").length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Pedidos
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 mt-1">
          {pedidos.length} pedidos · {pendientes} pendientes
        </p>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white border border-[#1A1A1A]/10 rounded-lg p-12 text-center">
          <p className="text-sm text-[#1A1A1A]/30">Sin pedidos todavía</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => {
            const siguiente = estadoSiguiente[pedido.estado]
            return (
              <div key={pedido.id} className="bg-white border border-[#1A1A1A]/10 rounded-lg p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-[#1A1A1A]">{pedido.cliente.nombre}</span>
                      <span className="text-xs text-[#1A1A1A]/40">{pedido.cliente.email}</span>
                    </div>

                    <div className="text-xs text-[#1A1A1A]/50 mb-3">
                      {pedido.items.map((item) => (
                        <span key={item.id}>
                          {item.libro.titulo} ×{item.cantidad}
                          {" "}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${estadoColores[pedido.estado]}`}
                      >
                        {pedido.estado}
                      </span>
                      <span className="text-sm font-semibold">{pedido.total.toFixed(2)} €</span>
                      <span className="text-xs text-[#1A1A1A]/30">
                        {pedido.createdAt.toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  </div>

                  {siguiente && (
                    <form
                      action={async () => {
                        "use server"
                        await actualizarEstadoPedido(pedido.id, siguiente)
                      }}
                    >
                      <button
                        type="submit"
                        className="shrink-0 bg-[#1A1A1A] text-white px-4 py-2 rounded text-xs font-semibold tracking-wide uppercase hover:bg-[#1A1A1A]/80 transition-colors whitespace-nowrap"
                      >
                        → {siguiente}
                      </button>
                    </form>
                  )}

                  {pedido.estado !== "CANCELADO" && pedido.estado !== "ENTREGADO" && (
                    <form
                      action={async () => {
                        "use server"
                        await actualizarEstadoPedido(pedido.id, "CANCELADO")
                      }}
                    >
                      <button
                        type="submit"
                        className="shrink-0 text-xs text-[#1A1A1A]/30 hover:text-[#D94F35] transition-colors"
                      >
                        Cancelar
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
