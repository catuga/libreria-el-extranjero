"use server"

import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { revalidatePath } from "next/cache"

export async function enviarNewsletter(formData: FormData) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const asunto = formData.get("asunto") as string
  const cuerpo = formData.get("cuerpo") as string

  if (!asunto || !cuerpo) {
    throw new Error("El asunto y el cuerpo son obligatorios")
  }

  // Obtener suscriptores activos
  const suscriptores = await prisma.suscriptor.findMany({
    where: { activo: true },
    select: { email: true },
  })

  if (suscriptores.length === 0) {
    throw new Error("No hay suscriptores activos")
  }

  // Guardar en BD
  const newsletter = await prisma.newsletter.create({
    data: { asunto, cuerpo },
  })

  // Enviar emails
  const emails = suscriptores.map((s) => s.email)

  // Enviamos en lotes de 50 para no sobrecargar Resend
  const batchSize = 50
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noticias@elextranjero.es",
      to: batch,
      subject: asunto,
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1A1A1A;">
          <h1 style="font-family: Georgia, serif; font-size: 28px; margin-bottom: 24px;">El Extranjero</h1>
          <div style="white-space: pre-wrap; line-height: 1.7;">${cuerpo}</div>
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e5e5;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            El Extranjero · Librería · Sevilla<br/>
            <a href="#" style="color: #999;">Darse de baja</a>
          </p>
        </div>
      `,
    })
  }

  // Marcar como enviado
  await prisma.newsletter.update({
    where: { id: newsletter.id },
    data: { enviadoAt: new Date() },
  })

  revalidatePath("/admin/newsletter")
}
