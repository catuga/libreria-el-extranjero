import { crearEvento } from "../actions"
import Link from "next/link"

export default function NuevoEvento() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Nuevo evento
        </h1>
      </div>

      <form action={crearEvento} className="space-y-6 max-w-lg">
        <div className="bg-white border border-[#1A1A1A]/10 rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Título *
            </label>
            <input
              name="titulo"
              type="text"
              required
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
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Imagen
            </label>
            <input
              name="imagen"
              type="file"
              accept="image/*"
              className="w-full text-sm text-[#1A1A1A]/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:tracking-widest file:uppercase file:bg-[#1A1A1A] file:text-white hover:file:bg-[#1A1A1A]/80"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-[#1A1A1A] text-white px-8 py-2.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#1A1A1A]/80 transition-colors"
          >
            Crear evento
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
