"use server"

import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function subirImagen(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null
  const ext = file.name.split(".").pop()
  const blob = await put(`slider/${Date.now()}.${ext}`, file, { access: "public" })
  return blob.url
}

export async function crearSlide(formData: FormData) {
  const titulo = formData.get("titulo") as string
  const descripcion = formData.get("descripcion") as string
  const etiqueta = formData.get("etiqueta") as string
  const color = formData.get("color") as string
  const orden = parseInt(formData.get("orden") as string) || 0

  const imagenFile = formData.get("imagen") as File | null
  const imagenUrl = imagenFile && imagenFile.size > 0 ? await subirImagen(imagenFile) : null

  await prisma.sliderItem.create({
    data: {
      titulo,
      descripcion: descripcion || null,
      etiqueta: etiqueta || null,
      color: color || "#D94F35",
      orden,
      imagen: imagenUrl,
    },
  })

  revalidatePath("/admin/slider")
  revalidatePath("/")
  redirect("/admin/slider")
}

export async function editarSlide(id: string, formData: FormData) {
  const titulo = formData.get("titulo") as string
  const descripcion = formData.get("descripcion") as string
  const etiqueta = formData.get("etiqueta") as string
  const color = formData.get("color") as string
  const orden = parseInt(formData.get("orden") as string) || 0
  const activo = formData.get("activo") === "on"

  const imagenFile = formData.get("imagen") as File | null
  const imagenUrl = imagenFile && imagenFile.size > 0 ? await subirImagen(imagenFile) : null

  await prisma.sliderItem.update({
    where: { id },
    data: {
      titulo,
      descripcion: descripcion || null,
      etiqueta: etiqueta || null,
      color: color || "#D94F35",
      orden,
      activo,
      ...(imagenUrl ? { imagen: imagenUrl } : {}),
    },
  })

  revalidatePath("/admin/slider")
  revalidatePath("/")
  redirect("/admin/slider")
}

export async function eliminarSlide(id: string) {
  await prisma.sliderItem.delete({ where: { id } })
  revalidatePath("/admin/slider")
  revalidatePath("/")
}
