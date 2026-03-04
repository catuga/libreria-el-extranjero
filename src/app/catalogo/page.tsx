import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

export const metadata = { title: "Catálogo — El Extranjero" }

export default async function CatalogoPage() {
  const libros = await prisma.libro.findMany({
    where: { activo: true },
    orderBy: { titulo: "asc" },
  })

  return (
    <div>
      <h1
        className="text-2xl md:text-4xl mb-6 md:mb-10 uppercase pt-4"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.02em" }}
      >
        Catálogo
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {libros.map((libro) => (
          <Link key={libro.id} href={`/libro/${libro.slug}`} className="group">
            <div className="relative bg-rojo/10 aspect-2/3 mb-3 overflow-hidden group-hover:bg-rojo/20 transition-colors">
              {libro.portada
                ? <Image src={libro.portada} alt={libro.titulo} fill className="object-cover" />
                : <span className="absolute inset-0 flex items-center justify-center text-[#E8321A]/40 text-xs">portada</span>
              }
            </div>
            <p className="font-medium text-sm leading-snug">{libro.titulo}</p>
            <p className="text-[#1A1A1A]/50 text-sm mt-0.5">{libro.autor}</p>
            <p className="text-[#E8321A] text-sm font-semibold mt-1">{libro.precio.toFixed(2)} €</p>
            {libro.stock === 0 && (
              <p className="text-[#1A1A1A]/40 text-xs mt-1">Sin stock</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
