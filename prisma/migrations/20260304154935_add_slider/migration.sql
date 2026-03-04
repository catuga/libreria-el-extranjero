-- CreateTable
CREATE TABLE "SliderItem" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "etiqueta" TEXT,
    "imagen" TEXT,
    "color" TEXT NOT NULL DEFAULT '#D94F35',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SliderItem_pkey" PRIMARY KEY ("id")
);
