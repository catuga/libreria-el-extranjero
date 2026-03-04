"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface LibroFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    titulo?: string
    autor?: string
    isbn?: string
    editorial?: string
    anio?: number | null
    precio?: number
    stock?: number
    descripcion?: string
    generos?: string[]
    destacado?: boolean
    slug?: string
    portada?: string | null
  }
  submitLabel: string
}

const fieldLabel = "block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2"
const fieldInput =
  "w-full border border-[#1A1A1A]/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]/40 bg-white"

export default function LibroForm({ action, defaultValues = {}, submitLabel }: LibroFormProps) {
  const [portadaPreview, setPortadaPreview] = useState<string | null>(defaultValues.portada || null)
  const [slugValue, setSlugValue] = useState(defaultValues.slug || "")

  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  function handleTituloChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!defaultValues.slug) {
      setSlugValue(slugify(e.target.value))
    }
  }

  function handlePortadaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPortadaPreview(URL.createObjectURL(file))
  }

  return (
    <form action={action} className="space-y-8 max-w-2xl">
      {/* Datos principales */}
      <section className="bg-white border border-[#1A1A1A]/10 rounded-lg p-6 space-y-5">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">Información principal</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={fieldLabel}>Título *</label>
            <input
              name="titulo"
              type="text"
              required
              defaultValue={defaultValues.titulo}
              onChange={handleTituloChange}
              className={fieldInput}
            />
          </div>

          <div>
            <label className={fieldLabel}>Autor *</label>
            <input name="autor" type="text" required defaultValue={defaultValues.autor} className={fieldInput} />
          </div>

          <div>
            <label className={fieldLabel}>ISBN</label>
            <input name="isbn" type="text" defaultValue={defaultValues.isbn} className={fieldInput} />
          </div>

          <div>
            <label className={fieldLabel}>Editorial</label>
            <input name="editorial" type="text" defaultValue={defaultValues.editorial} className={fieldInput} />
          </div>

          <div>
            <label className={fieldLabel}>Año</label>
            <input
              name="anio"
              type="number"
              min="1800"
              max="2099"
              defaultValue={defaultValues.anio ?? ""}
              className={fieldInput}
            />
          </div>
        </div>
      </section>

      {/* Precio y stock */}
      <section className="bg-white border border-[#1A1A1A]/10 rounded-lg p-6 space-y-5">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">Precio y stock</h2>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={fieldLabel}>Precio (€) *</label>
            <input
              name="precio"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={defaultValues.precio}
              className={fieldInput}
            />
          </div>

          <div>
            <label className={fieldLabel}>Stock</label>
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue={defaultValues.stock ?? 0}
              className={fieldInput}
            />
          </div>
        </div>
      </section>

      {/* Descripción y géneros */}
      <section className="bg-white border border-[#1A1A1A]/10 rounded-lg p-6 space-y-5">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">Descripción y categorías</h2>

        <div>
          <label className={fieldLabel}>Descripción</label>
          <textarea name="descripcion" rows={4} defaultValue={defaultValues.descripcion} className={`${fieldInput} resize-none`} />
        </div>

        <div>
          <label className={fieldLabel}>Géneros (separados por comas)</label>
          <input
            name="generos"
            type="text"
            defaultValue={defaultValues.generos?.join(", ")}
            placeholder="Novela, Ficción, Literatura española..."
            className={fieldInput}
          />
        </div>
      </section>

      {/* Portada */}
      <section className="bg-white border border-[#1A1A1A]/10 rounded-lg p-6 space-y-5">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">Portada</h2>

        <div className="flex items-start gap-5">
          {portadaPreview && (
            <div className="relative w-20 h-28 shrink-0">
              <Image
                src={portadaPreview}
                alt="Preview portada"
                fill
                className="object-cover rounded border border-[#1A1A1A]/10"
              />
            </div>
          )}
          <div className="flex-1">
            <input
              name="portada"
              type="file"
              accept="image/*"
              onChange={handlePortadaChange}
              className="w-full text-sm text-[#1A1A1A]/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:tracking-widest file:uppercase file:bg-[#1A1A1A] file:text-white hover:file:bg-[#1A1A1A]/80"
            />
            {defaultValues.portada && (
              <p className="text-xs text-[#1A1A1A]/40 mt-2">Selecciona un archivo para reemplazar la portada actual</p>
            )}
          </div>
        </div>
      </section>

      {/* Opciones */}
      <section className="bg-white border border-[#1A1A1A]/10 rounded-lg p-6 space-y-5">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40">Opciones</h2>

        <div>
          <label className={fieldLabel}>Slug (URL)</label>
          <input
            name="slug"
            type="text"
            value={slugValue}
            onChange={(e) => setSlugValue(e.target.value)}
            className={`${fieldInput} font-mono`}
          />
          <p className="text-xs text-[#1A1A1A]/40 mt-1">/libro/{slugValue || "slug-del-libro"}</p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            name="destacado"
            type="checkbox"
            defaultChecked={defaultValues.destacado}
            className="w-4 h-4 rounded border-[#1A1A1A]/30 accent-[#D94F35]"
          />
          <span className="text-sm text-[#1A1A1A]">Mostrar en página de inicio (destacado)</span>
        </label>
      </section>

      {/* Acciones */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="bg-[#1A1A1A] text-white px-8 py-2.5 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#1A1A1A]/80 transition-colors"
        >
          {submitLabel}
        </button>
        <Link
          href="/admin/libros"
          className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}
