import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import Slider from "@/components/Slider"

export default async function HomePage() {
  const [destacados, slides] = await Promise.all([
    prisma.libro.findMany({
      where: { destacado: true, activo: true },
      take: 3,
    }),
    prisma.sliderItem.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    }),
  ])

  return (
    <div className="space-y-10 md:space-y-16">

      {/* Slider de eventos — negativo para anular el px-4 del main */}
      <div className="-mx-4 md:mx-0">
        <Slider slides={slides} />
      </div>

      {/* Sección recomendados — estilo Materia Prima */}
      <section>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 mb-6 md:mb-8 pb-3 border-b border-[#1A1A1A]/10">
          Selección de la casa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {destacados.map((libro) => (
            <Link key={libro.id} href={`/libro/${libro.slug}`} className="group">
              {/* Cover grande */}
              <div className="relative bg-[#E8321A]/8 aspect-[3/4] overflow-hidden mb-5 group-hover:bg-[#E8321A]/15 transition-colors">
                {libro.portada
                  ? <Image src={libro.portada} alt={libro.titulo} fill className="object-cover" />
                  : <span className="absolute inset-0 flex items-center justify-center text-[#E8321A]/30 text-xs uppercase tracking-widest">portada</span>
                }
                {/* Etiqueta superpuesta al hover — estilo Materia Prima */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <span
                    className="inline-block text-xs font-semibold tracking-wider px-3 py-1.5"
                    style={{ backgroundColor: "#FFFFFF", color: "#E8321A" }}
                  >
                    {libro.generos[0] ?? "LITERATURA"}
                  </span>
                </div>
              </div>
              {/* Info — estilo Materia Prima: uppercase, bold */}
              <p className="font-semibold text-sm uppercase tracking-wide leading-snug">
                {libro.titulo}
              </p>
              <p
                className="text-[#1A1A1A]/60 text-sm mt-0.5 italic"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {libro.autor}
              </p>
              <p className="text-[#1A1A1A]/40 text-xs mt-1 uppercase tracking-wide">
                {libro.precio.toFixed(2)} €
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/catalogo"
            className="text-xs font-semibold tracking-widest uppercase border-b border-[#1A1A1A]/30 pb-0.5 hover:border-[#E8321A] hover:text-[#E8321A] transition-colors"
          >
            Ver catálogo completo →
          </Link>
        </div>
      </section>

    </div>
  )
}
