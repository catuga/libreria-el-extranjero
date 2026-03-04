import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { eliminarSlide } from "./actions"

export default async function AdminSlider() {
  const slides = await prisma.sliderItem.findMany({
    orderBy: { orden: "asc" },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Slider de inicio
          </h1>
          <p className="text-sm text-[#1A1A1A]/40 mt-1">
            {slides.filter((s) => s.activo).length} activos · aparecen en la portada de la web
          </p>
        </div>
        <Link
          href="/admin/slider/nuevo"
          className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#1A1A1A]/80 transition-colors"
        >
          + Nueva diapositiva
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="bg-white border border-[#1A1A1A]/10 rounded-lg p-12 text-center">
          <p className="text-sm text-[#1A1A1A]/30 mb-4">Sin diapositivas todavía</p>
          <Link
            href="/admin/slider/nuevo"
            className="text-xs font-semibold tracking-widest uppercase text-[#E8321A] hover:underline"
          >
            Crear primera diapositiva →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`bg-white border border-[#1A1A1A]/10 rounded-lg overflow-hidden flex items-stretch ${!slide.activo ? "opacity-50" : ""}`}
            >
              {/* Color swatch + imagen */}
              <div className="relative w-32 shrink-0" style={{ backgroundColor: slide.color }}>
                {slide.imagen && (
                  <Image src={slide.imagen} alt={slide.titulo} fill className="object-cover" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  {!slide.imagen && (
                    <span className="text-white/40 text-2xl font-bold">{slide.orden}</span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  {slide.etiqueta && (
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 mb-1 block">
                      {slide.etiqueta}
                    </span>
                  )}
                  <p className="font-medium text-[#1A1A1A]">{slide.titulo}</p>
                  {slide.descripcion && (
                    <p className="text-sm text-[#1A1A1A]/50 mt-0.5 line-clamp-1">{slide.descripcion}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-[#1A1A1A]/30">Orden: {slide.orden}</span>
                    <span
                      className={`text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${
                        slide.activo ? "bg-green-50 text-green-700" : "bg-[#1A1A1A]/5 text-[#1A1A1A]/40"
                      }`}
                    >
                      {slide.activo ? "Activo" : "Oculto"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <Link
                    href={`/admin/slider/${slide.id}/editar`}
                    className="text-xs text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
                  >
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server"
                      await eliminarSlide(slide.id)
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs text-[#1A1A1A]/30 hover:text-[#E8321A] transition-colors"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[#1A1A1A]/30 mt-6">
        Las diapositivas se muestran ordenadas por el campo "Orden" (menor primero).
      </p>
    </div>
  )
}
