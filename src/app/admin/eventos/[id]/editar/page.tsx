import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { editarEvento } from "../../actions"
import Link from "next/link"
import Image from "next/image"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarEvento({ params }: Props) {
  const { id } = await params
  const evento = await prisma.evento.findUnique({ where: { id } })

  if (!evento) notFound()

  const action = editarEvento.bind(null, evento.id)

  // Format date for datetime-local input
  const fechaLocal = evento.fecha.toISOString().slice(0, 16)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Editar evento
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 mt-1">{evento.titulo}</p>
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
              defaultValue={evento.titulo}
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Fecha *
            </label>
            <input
              name="fecha"
              type="datetime-local"
              required
              defaultValue={fechaLocal}
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              rows={4}
              defaultValue={evento.descripcion ?? ""}
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Imagen
            </label>
            {evento.imagen && (
              <div className="relative h-32 w-full mb-3 rounded overflow-hidden">
                <Image src={evento.imagen} alt={evento.titulo} fill className="object-cover" />
              </div>
            )}
            <input
              name="imagen"
              type="file"
              accept="image/*"
              className="w-full text-sm text-[#1A1A1A]/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:tracking-widest file:uppercase file:bg-[#1A1A1A] file:text-white hover:file:bg-[#1A1A1A]/80"
            />
            {evento.imagen && (
              <p className="text-xs text-[#1A1A1A]/40 mt-1">Selecciona un archivo para reemplazar la imagen</p>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input
              name="activo"
              type="checkbox"
              defaultChecked={evento.activo}
              value="true"
              className="w-4 h-4 rounded border-[#1A1A1A]/30 accent-[#E8321A]"
            />
            <span className="text-sm text-[#1A1A1A]">Evento activo (visible en la web)</span>
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
            href="/admin/eventos"
            className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
