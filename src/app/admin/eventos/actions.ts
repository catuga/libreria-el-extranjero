"use server"

import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function subirImagen(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null
  const ext = file.name.split(".").pop()
  const filename = `eventos/${Date.now()}.${ext}`
  const blob = await put(filename, file, { access: "public" })
  return blob.url
}

export async function crearEvento(formData: FormData) {
  const titulo = formData.get("titulo") as string
  const fecha = new Date(formData.get("fecha") as string)
  const descripcion = formData.get("descripcion") as string
  const activo = formData.get("activo") !== "false"

  const imagenFile = formData.get("imagen") as File | null
  const imagenUrl = imagenFile && imagenFile.size > 0 ? await subirImagen(imagenFile) : null

  await prisma.evento.create({
    data: {
      titulo,
      fecha,
      descripcion: descripcion || null,
      imagen: imagenUrl,
      activo,
    },
  })

  revalidatePath("/admin/eventos")
  revalidatePath("/eventos")
  redirect("/admin/eventos")
}

export async function editarEvento(id: string, formData: FormData) {
  const titulo = formData.get("titulo") as string
  const fecha = new Date(formData.get("fecha") as string)
  const descripcion = formData.get("descripcion") as string
  const activo = formData.get("activo") !== "false"

  const imagenFile = formData.get("imagen") as File | null
  let imagenUrl: string | null = null

  if (imagenFile && imagenFile.size > 0) {
    imagenUrl = await subirImagen(imagenFile)
  }

  await prisma.evento.update({
    where: { id },
    data: {
      titulo,
      fecha,
      descripcion: descripcion || null,
      activo,
      ...(imagenUrl ? { imagen: imagenUrl } : {}),
    },
  })

  revalidatePath("/admin/eventos")
  revalidatePath("/eventos")
  redirect("/admin/eventos")
}

export async function archivarEvento(id: string) {
  await prisma.evento.update({
    where: { id },
    data: { activo: false },
  })
  revalidatePath("/admin/eventos")
  revalidatePath("/eventos")
}
