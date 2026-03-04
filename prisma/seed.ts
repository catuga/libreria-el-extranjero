import { PrismaClient } from "../src/generated/prisma/index.js"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Sembrando datos de prueba...")

  // Limpiar tablas en orden (por dependencias)
  await prisma.itemPedido.deleteMany()
  await prisma.pedido.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.suscriptor.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.libro.deleteMany()
  await prisma.adminUser.deleteMany()

  // ─── LIBROS ────────────────────────────────────────────────
  const libros = await prisma.libro.createMany({
    data: [
      {
        titulo: "El nombre del viento",
        autor: "Patrick Rothfuss",
        isbn: "9788401337208",
        editorial: "Plaza & Janés",
        anio: 2008,
        precio: 22.9,
        stock: 5,
        descripcion:
          "La historia de Kvothe, un legendario mago y músico narrada en primera persona.",
        slug: "el-nombre-del-viento",
        destacado: true,
        generos: ["Fantasía", "Aventura"],
      },
      {
        titulo: "Cien años de soledad",
        autor: "Gabriel García Márquez",
        isbn: "9788497592208",
        editorial: "Alfaguara",
        anio: 1967,
        precio: 19.9,
        stock: 8,
        descripcion:
          "La saga de la familia Buendía a lo largo de siete generaciones en Macondo.",
        slug: "cien-anos-de-soledad",
        destacado: true,
        generos: ["Realismo mágico", "Clásico"],
      },
      {
        titulo: "La sombra del viento",
        autor: "Carlos Ruiz Zafón",
        isbn: "9788408163435",
        editorial: "Planeta",
        anio: 2001,
        precio: 21.5,
        stock: 3,
        descripcion:
          "Un joven descubre un libro misterioso en el Cementerio de los Libros Olvidados de Barcelona.",
        slug: "la-sombra-del-viento",
        destacado: true,
        generos: ["Misterio", "Histórico"],
      },
      {
        titulo: "Sapiens",
        autor: "Yuval Noah Harari",
        isbn: "9788499926223",
        editorial: "Debate",
        anio: 2014,
        precio: 24.9,
        stock: 6,
        descripcion: "Una breve historia de la humanidad desde el origen.",
        slug: "sapiens",
        destacado: false,
        generos: ["No ficción", "Historia"],
      },
      {
        titulo: "El principito",
        autor: "Antoine de Saint-Exupéry",
        isbn: "9788478886296",
        editorial: "Salamandra",
        anio: 1943,
        precio: 12.9,
        stock: 12,
        descripcion: "Un clásico universal sobre la amistad y lo esencial.",
        slug: "el-principito",
        destacado: false,
        generos: ["Clásico", "Infantil"],
      },
      {
        titulo: "Dune",
        autor: "Frank Herbert",
        isbn: "9788466338592",
        editorial: "Debolsillo",
        anio: 1965,
        precio: 18.5,
        stock: 4,
        descripcion: "La épica ciencia ficción sobre el planeta desértico Arrakis.",
        slug: "dune",
        destacado: true,
        generos: ["Ciencia ficción", "Aventura"],
      },
    ],
  })

  // ─── SUSCRIPTORES ──────────────────────────────────────────
  await prisma.suscriptor.createMany({
    data: [
      { email: "maria@ejemplo.com", nombre: "María García" },
      { email: "juan@ejemplo.com", nombre: "Juan Pérez" },
      { email: "ana@ejemplo.com", nombre: "Ana Martínez" },
    ],
  })

  // ─── ADMIN ─────────────────────────────────────────────────
  // Contraseña de prueba: "admin123" (luego la hashearemos con bcrypt)
  await prisma.adminUser.create({
    data: {
      email: "admin@libreria.com",
      password: "admin123_cambiar_esto",
      nombre: "Admin",
    },
  })

  console.log(`✅ ${libros.count} libros creados`)
  console.log("✅ 3 suscriptores creados")
  console.log("✅ Usuario admin creado")
  console.log("🎉 Seed completado")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
