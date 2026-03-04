"use server"

import { prisma } from "@/lib/prisma"
import { EstadoPedido } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function actualizarEstadoPedido(pedidoId: string, estado: EstadoPedido) {
  await prisma.pedido.update({
    where: { id: pedidoId },
    data: { estado },
  })
  revalidatePath("/admin/pedidos")
}
