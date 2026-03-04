"use server"

import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

async function subirPortada(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null
  const ext = file.name.split(".").pop()
  const filename = `portadas/${Date.now()}.${ext}`
  const blob = await put(filename, file, { access: "public" })
  return blob.url
}

export async function crearLibro(formData: FormData) {
  const titulo = formData.get("titulo") as string
  const autor = formData.get("autor") as string
  const isbn = formData.get("isbn") as string
  const editorial = formData.get("editorial") as string
  const anio = formData.get("anio") ? parseInt(formData.get("anio") as string) : null
  const precio = parseFloat(formData.get("precio") as string)
  const stock = parseInt(formData.get("stock") as string) || 0
  const descripcion = formData.get("descripcion") as string
  const generosRaw = formData.get("generos") as string
  const generos = generosRaw ? generosRaw.split(",").map((g) => g.trim()).filter(Boolean) : []
  const destacado = formData.get("destacado") === "on"
  const slugManual = formData.get("slug") as string
  const slug = slugManual || slugify(titulo)

  const portadaFile = formData.get("portada") as File | null
  const portadaUrl = portadaFile && portadaFile.size > 0 ? await subirPortada(portadaFile) : null

  await prisma.libro.create({
    data: {
      titulo,
      autor,
      isbn: isbn || null,
      editorial: editorial || null,
      anio,
      precio,
      stock,
      descripcion: descripcion || null,
      generos,
      destacado,
      slug,
      portada: portadaUrl,
    },
  })

  revalidatePath("/admin/libros")
  revalidatePath("/catalogo")
  revalidatePath("/")
  redirect("/admin/libros")
}

export async function editarLibro(id: string, formData: FormData) {
  const titulo = formData.get("titulo") as string
  const autor = formData.get("autor") as string
  const isbn = formData.get("isbn") as string
  const editorial = formData.get("editorial") as string
  const anio = formData.get("anio") ? parseInt(formData.get("anio") as string) : null
  const precio = parseFloat(formData.get("precio") as string)
  const stock = parseInt(formData.get("stock") as string) || 0
  const descripcion = formData.get("descripcion") as string
  const generosRaw = formData.get("generos") as string
  const generos = generosRaw ? generosRaw.split(",").map((g) => g.trim()).filter(Boolean) : []
  const destacado = formData.get("destacado") === "on"
  const slugManual = formData.get("slug") as string
  const slug = slugManual || slugify(titulo)

  const portadaFile = formData.get("portada") as File | null
  let portadaUrl: string | null = null

  if (portadaFile && portadaFile.size > 0) {
    portadaUrl = await subirPortada(portadaFile)
  }

  await prisma.libro.update({
    where: { id },
    data: {
      titulo,
      autor,
      isbn: isbn || null,
      editorial: editorial || null,
      anio,
      precio,
      stock,
      descripcion: descripcion || null,
      generos,
      destacado,
      slug,
      ...(portadaUrl ? { portada: portadaUrl } : {}),
    },
  })

  revalidatePath("/admin/libros")
  revalidatePath(`/libro/${slug}`)
  revalidatePath("/catalogo")
  revalidatePath("/")
  redirect("/admin/libros")
}

export async function archivarLibro(id: string) {
  await prisma.libro.update({
    where: { id },
    data: { activo: false },
  })
  revalidatePath("/admin/libros")
  revalidatePath("/catalogo")
}

export async function restaurarLibro(id: string) {
  await prisma.libro.update({
    where: { id },
    data: { activo: true },
  })
  revalidatePath("/admin/libros")
  revalidatePath("/catalogo")
}

export async function toggleDestacado(id: string, destacado: boolean) {
  await prisma.libro.update({
    where: { id },
    data: { destacado: !destacado },
  })
  revalidatePath("/admin/libros")
  revalidatePath("/")
}
