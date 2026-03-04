import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default async function LibroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const libro = await prisma.libro.findUnique({ where: { slug } })

  if (!libro || !libro.activo) notFound()

  return (
    <div>
      <Link href="/catalogo" className="text-sm text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors mb-6 inline-block pt-4">
        ← Volver al catálogo
      </Link>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-2">
        {/* Portada */}
        <div className="relative bg-[#D94F35]/10 w-full max-w-[220px] mx-auto md:mx-0 md:w-56 aspect-[2/3] flex-shrink-0 overflow-hidden">
          {libro.portada
            ? <Image src={libro.portada} alt={libro.titulo} fill className="object-cover" />
            : <span className="absolute inset-0 flex items-center justify-center text-[#D94F35]/40 text-sm">portada</span>
          }
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1
            className="text-3xl leading-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {libro.titulo}
          </h1>
          <p className="text-[#1A1A1A]/60 mt-2 text-lg">{libro.autor}</p>
          {libro.editorial && (
            <p className="text-[#1A1A1A]/40 text-sm mt-1">
              {libro.editorial}{libro.anio ? ` · ${libro.anio}` : ""}
            </p>
          )}

          <p className="text-[#D94F35] text-2xl font-semibold mt-6">
            {libro.precio.toFixed(2)} €
          </p>
          <p className={`text-sm mt-1 ${libro.stock > 0 ? "text-green-700" : "text-[#1A1A1A]/40"}`}>
            {libro.stock > 0 ? `${libro.stock} en stock` : "Sin stock"}
          </p>

          {libro.descripcion && (
            <p className="text-[#1A1A1A]/70 mt-6 leading-relaxed">{libro.descripcion}</p>
          )}

          {libro.generos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {libro.generos.map((g) => (
                <span
                  key={g}
                  className="border border-[#1A1A1A]/15 text-[#1A1A1A]/50 text-xs px-3 py-1"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
