import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { editarSlide } from "../../actions"
import Link from "next/link"
import Image from "next/image"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarSlide({ params }: Props) {
  const { id } = await params
  const slide = await prisma.sliderItem.findUnique({ where: { id } })

  if (!slide) notFound()

  const action = editarSlide.bind(null, slide.id)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Editar diapositiva
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 mt-1">{slide.titulo}</p>
      </div>

      <form action={action} className="space-y-6 max-w-lg">
        <div className="bg-white border border-[#1A1A1A]/10 rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Título *
            </label>
            <input
              name="titulo"
              type="text"
              required
              defaultValue={slide.titulo}
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              rows={2}
              defaultValue={slide.descripcion ?? ""}
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Etiqueta
            </label>
            <input
              name="etiqueta"
              type="text"
              defaultValue={slide.etiqueta ?? ""}
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
                Color de fondo
              </label>
              <input
                name="color"
                type="color"
                defaultValue={slide.color}
                className="w-10 h-10 rounded border border-[#1A1A1A]/15 cursor-pointer p-0.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
                Orden
              </label>
              <input
                name="orden"
                type="number"
                min="0"
                defaultValue={slide.orden}
                className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Imagen de fondo
            </label>
            {slide.imagen && (
              <div className="relative h-28 w-full mb-3 rounded overflow-hidden">
                <Image src={slide.imagen} alt={slide.titulo} fill className="object-cover" />
              </div>
            )}
            <input
              name="imagen"
              type="file"
              accept="image/*"
              className="w-full text-sm text-[#1A1A1A]/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:tracking-widest file:uppercase file:bg-[#1A1A1A] file:text-white hover:file:bg-[#1A1A1A]/80"
            />
            {slide.imagen && (
              <p className="text-xs text-[#1A1A1A]/40 mt-1">Selecciona un archivo para reemplazar la imagen actual</p>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input
              name="activo"
              type="checkbox"
              defaultChecked={slide.activo}
              className="w-4 h-4 rounded border-[#1A1A1A]/30 accent-[#D94F35]"
            />
            <span className="text-sm text-[#1A1A1A]">Diapositiva activa (visible en la web)</span>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-[#1A1A1A] text-white px-8 py-2.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#1A1A1A]/80 transition-colors"
          >
            Guardar cambios
          </button>
          <Link
            href="/admin/slider"
            className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
