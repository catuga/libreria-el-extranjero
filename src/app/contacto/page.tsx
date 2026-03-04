import { Resend } from "resend"
import { redirect } from "next/navigation"

async function enviarContacto(formData: FormData) {
  "use server"

  const resend = new Resend(process.env.RESEND_API_KEY)
  const nombre = formData.get("nombre") as string
  const email = formData.get("email") as string
  const mensaje = formData.get("mensaje") as string

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noticias@elextranjero.es",
    to: process.env.RESEND_TO_EMAIL || "hola@elextranjero.es",
    subject: `Mensaje de contacto de ${nombre}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1A1A1A;">
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p style="white-space: pre-wrap;">${mensaje}</p>
      </div>
    `,
    replyTo: email,
  })

  redirect("/contacto?enviado=1")
}

interface Props {
  searchParams: Promise<{ enviado?: string }>
}

export default async function ContactoPage({ searchParams }: Props) {
  const { enviado } = await searchParams

  return (
    <div className="max-w-lg mx-auto py-8 md:py-16">
      <div className="mb-10">
        <h1
          className="text-2xl md:text-4xl uppercase tracking-wide text-[#1A1A1A] mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Contacto
        </h1>
        <p className="text-[#1A1A1A]/60 leading-relaxed">
          ¿Tienes alguna pregunta, quieres saber si tenemos un libro, o simplemente quieres saludar? Escríbenos.
        </p>
      </div>

      {enviado ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-800 font-medium mb-1">Mensaje enviado</p>
          <p className="text-green-700 text-sm">Te responderemos pronto. ¡Gracias!</p>
        </div>
      ) : (
        <form action={enviarContacto} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Nombre *
            </label>
            <input
              name="nombre"
              type="text"
              required
              className="w-full border border-[#1A1A1A]/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#1A1A1A]/50 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Email *
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-[#1A1A1A]/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#1A1A1A]/50 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A1A]/50 mb-2">
              Mensaje *
            </label>
            <textarea
              name="mensaje"
              required
              rows={6}
              className="w-full border border-[#1A1A1A]/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#1A1A1A]/50 bg-white resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A1A1A] text-white py-3 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#1A1A1A]/80 transition-colors"
          >
            Enviar mensaje
          </button>
        </form>
      )}

      <div className="mt-12 pt-8 border-t border-[#1A1A1A]/10">
        <div className="space-y-3 text-sm text-[#1A1A1A]/60">
          <p>
            <span className="font-semibold text-[#1A1A1A]">El Extranjero</span> · Librería & Taller
          </p>
          <p>Sevilla</p>
          <p>
            <a href="mailto:hola@elextranjero.es" className="hover:text-[#E8321A] transition-colors">
              hola@elextranjero.es
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
