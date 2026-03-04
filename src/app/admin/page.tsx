import { prisma } from "@/lib/prisma"
import Link from "next/link"

async function getStats() {
  const [libros, suscriptores, pedidosPendientes, clientes] = await Promise.all([
    prisma.libro.count({ where: { activo: true } }),
    prisma.suscriptor.count({ where: { activo: true } }),
    prisma.pedido.count({ where: { estado: "PENDIENTE" } }),
    prisma.cliente.count(),
  ])
  return { libros, suscriptores, pedidosPendientes, clientes }
}

const stats = [
  { label: "Libros activos", href: "/admin/libros", key: "libros" },
  { label: "Suscriptores", href: "/admin/clientes", key: "suscriptores" },
  { label: "Pedidos pendientes", href: "/admin/pedidos", key: "pedidosPendientes" },
  { label: "Clientes", href: "/admin/clientes", key: "clientes" },
]

const accesosRapidos = [
  { href: "/admin/libros/nuevo", label: "Añadir libro" },
  { href: "/admin/newsletter", label: "Enviar newsletter" },
  { href: "/admin/eventos/nuevo", label: "Crear evento" },
  { href: "/catalogo", label: "Ver tienda →", external: true },
]

export default async function AdminDashboard() {
  const data = await getStats()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 mt-1">
          {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, href, key }) => (
          <Link
            key={key}
            href={href}
            className="bg-white border border-[#1A1A1A]/10 rounded-lg p-5 hover:border-[#1A1A1A]/30 transition-colors group"
          >
            <p className="text-3xl font-semibold text-[#1A1A1A] group-hover:text-[#E8321A] transition-colors">
              {data[key as keyof typeof data]}
            </p>
            <p className="text-xs tracking-widest uppercase text-[#1A1A1A]/40 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 mb-3">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-3">
          {accesosRapidos.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="bg-white border border-[#1A1A1A]/10 rounded px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
