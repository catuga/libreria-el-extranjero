import LibroForm from "@/components/admin/LibroForm"
import { crearLibro } from "../actions"

export default function NuevoLibro() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Nuevo libro
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 mt-1">Añadir un libro al catálogo</p>
      </div>

      <LibroForm action={crearLibro} submitLabel="Crear libro" />
    </div>
  )
}
