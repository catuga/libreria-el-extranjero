import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import LibroForm from "@/components/admin/LibroForm"
import { editarLibro } from "../../actions"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarLibro({ params }: Props) {
  const { id } = await params
  const libro = await prisma.libro.findUnique({ where: { id } })

  if (!libro) notFound()

  const action = editarLibro.bind(null, libro.id)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl uppercase tracking-wide text-[#1A1A1A]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Editar libro
        </h1>
        <p className="text-sm text-[#1A1A1A]/40 mt-1">{libro.titulo}</p>
      </div>

      <LibroForm
        action={action}
        submitLabel="Guardar cambios"
        defaultValues={{
          titulo: libro.titulo,
          autor: libro.autor,
          isbn: libro.isbn ?? undefined,
          editorial: libro.editorial ?? undefined,
          anio: libro.anio,
          precio: libro.precio,
          stock: libro.stock,
          descripcion: libro.descripcion ?? undefined,
          generos: libro.generos,
          destacado: libro.destacado,
          slug: libro.slug,
          portada: libro.portada,
        }}
      />
    </div>
  )
}
