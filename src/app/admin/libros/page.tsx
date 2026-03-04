import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { archivarLibro, restaurarLibro, toggleDestacado } from "./actions"
import Image from "next/image"

type LibroRow = Awaited<ReturnType<typeof prisma.libro.findMany>>[number]

export default async function AdminLibros() {
  const libros: LibroRow[] = await prisma.libro.findMany({
    orderBy: { createdAt: "desc" },
  })

  const activos = libros.filter((l) => l.activo)
  const archivados = libros.filter((l) => !l.activo)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Libros
          </h1>
          <p className="text-sm text-[#1A1A1A]/40 mt-1">{activos.length} activos · {archivados.length} archivados</p>
        </div>
        <Link
          href="/admin/libros/nuevo"
          className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#1A1A1A]/80 transition-colors"
        >
          + Nuevo libro
        </Link>
      </div>

      <div className="bg-white border border-[#1A1A1A]/10 rounded-lg overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1A1A1A]/10 bg-[#F9F9F7]">
              <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">
                Libro
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 hidden md:table-cell">
                Autor
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">
                Precio
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 hidden sm:table-cell">
                Stock
              </th>
              <th className="text-center px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 hidden lg:table-cell">
                Destacado
              </th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {activos.map((libro) => (
              <tr key={libro.id} className="border-b border-[#1A1A1A]/5 last:border-0 hover:bg-[#F9F9F7]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {libro.portada ? (
                      <div className="relative w-8 h-11 shrink-0">
                        <Image src={libro.portada} alt={libro.titulo} fill className="object-cover rounded" />
                      </div>
                    ) : (
                      <div className="w-8 h-11 bg-[#1A1A1A]/5 rounded shrink-0" />
                    )}
                    <span className="font-medium text-[#1A1A1A] truncate max-w-[160px]">{libro.titulo}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#1A1A1A]/60 hidden md:table-cell">{libro.autor}</td>
                <td className="px-5 py-3 text-right font-medium">{libro.precio.toFixed(2)} €</td>
                <td className="px-5 py-3 text-right text-[#1A1A1A]/60 hidden sm:table-cell">
                  {libro.stock > 0 ? (
                    <span>{libro.stock}</span>
                  ) : (
                    <span className="text-[#D94F35]">Sin stock</span>
                  )}
                </td>
                <td className="px-5 py-3 text-center hidden lg:table-cell">
                  <form
                    action={async () => {
                      "use server"
                      await toggleDestacado(libro.id, libro.destacado)
                    }}
                  >
                    <button
                      type="submit"
                      className={`text-lg ${libro.destacado ? "opacity-100" : "opacity-20 hover:opacity-60"} transition-opacity`}
                      title={libro.destacado ? "Quitar de destacados" : "Marcar como destacado"}
                    >
                      ★
                    </button>
                  </form>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 justify-end">
                    <Link
                      href={`/admin/libros/${libro.id}/editar`}
                      className="text-xs text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
                    >
                      Editar
                    </Link>
                    <form
                      action={async () => {
                        "use server"
                        await archivarLibro(libro.id)
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {archivados.length > 0 && (
        <details className="bg-white border border-[#1A1A1A]/10 rounded-lg overflow-hidden">
          <summary className="px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 cursor-pointer hover:text-[#1A1A1A]/60">
            Archivados ({archivados.length})
          </summary>
          <table className="w-full text-sm border-t border-[#1A1A1A]/10">
            <tbody>
              {archivados.map((libro) => (
                <tr key={libro.id} className="border-b border-[#1A1A1A]/5 last:border-0 opacity-50">
                  <td className="px-5 py-3 font-medium">{libro.titulo}</td>
                  <td className="px-5 py-3 text-[#1A1A1A]/60 hidden md:table-cell">{libro.autor}</td>
                  <td className="px-5 py-3 text-right">{libro.precio.toFixed(2)} €</td>
                  <td className="px-5 py-3 text-right">
                    <form
                      action={async () => {
                        "use server"
                        await restaurarLibro(libro.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
                      >
                        Restaurar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </div>
  )
}
