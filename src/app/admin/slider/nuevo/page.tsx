import { crearSlide } from "../actions"
import Link from "next/link"

export default function NuevoSlide() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Nueva diapositiva
        </h1>
      </div>

      <form action={crearSlide} className="space-y-6 max-w-lg">
        <div className="bg-white border border-[#1A1A1A]/10 rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Título *
            </label>
            <input
              name="titulo"
              type="text"
              required
              placeholder="Presentación: La ciudad y sus muros"
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
              placeholder="Jueves 20 de marzo · 19:00h · El Extranjero, Sevilla"
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Etiqueta (opcional)
            </label>
            <input
              name="etiqueta"
              type="text"
              placeholder="EVENTO · NUEVO · CLUB DE LECTURA"
              className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
                Color de fondo
              </label>
              <div className="flex items-center gap-3">
                <input
                  name="color"
                  type="color"
                  defaultValue="#E8321A"
                  className="w-10 h-10 rounded border border-[#1A1A1A]/15 cursor-pointer p-0.5"
                />
                <span className="text-xs text-[#1A1A1A]/40">Se usa si no hay imagen</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
                Orden
              </label>
              <input
                name="orden"
                type="number"
                min="0"
                defaultValue="0"
                className="w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Imagen de fondo
            </label>
            <input
              name="imagen"
              type="file"
              accept="image/*"
              className="w-full text-sm text-[#1A1A1A]/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:tracking-widest file:uppercase file:bg-[#1A1A1A] file:text-white hover:file:bg-[#1A1A1A]/80"
            />
            <p className="text-xs text-[#1A1A1A]/30 mt-1">Recomendado: 1600×700px o mayor</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-[#1A1A1A] text-white px-8 py-2.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#1A1A1A]/80 transition-colors"
          >
            Crear diapositiva
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
