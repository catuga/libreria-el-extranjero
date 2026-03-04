"use client"

import { useState } from "react"
import Image from "next/image"

type Slide = {
  id: string
  titulo: string
  descripcion: string
  etiqueta?: string
  imagen?: string
  color?: string
}

const SLIDES_PRUEBA: Slide[] = [
  {
    id: "1",
    titulo: "Presentación: La ciudad y sus muros",
    descripcion: "Jueves 20 de marzo · 19:00h · El Extranjero, Sevilla",
    etiqueta: "EVENTO",
    color: "#D94F35",
    imagen: "/fotos/slider-1.jpg",
  },
  {
    id: "2",
    titulo: "Club de lectura de marzo",
    descripcion: "Este mes leemos «El túnel» de Ernesto Sabato. Apúntate gratis.",
    etiqueta: "CLUB DE LECTURA",
    color: "#2A2A2A",
    imagen: "/fotos/slider-2.jpg",
  },
  {
    id: "3",
    titulo: "Novedades de primavera",
    descripcion: "Han llegado nuevos títulos seleccionados por el equipo de la librería.",
    etiqueta: "NUEVO",
    color: "#5C4A3A",
    imagen: "/fotos/slider-3.jpg",
  },
]

export default function Slider() {
  const [current, setCurrent] = useState(0)
  const slides = SLIDES_PRUEBA

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1))

  const slide = slides[current]

  return (
    <div
      className="relative w-full aspect-[16/7] md:aspect-[16/6] overflow-hidden flex items-end"
      style={{ backgroundColor: slide.color ?? "#D94F35", transition: "background-color 0.4s ease" }}
    >
      {/* Imagen de fondo */}
      {slide.imagen && (
        <Image
          src={slide.imagen}
          alt=""
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Gradiente para legibilidad del texto cuando hay imagen */}
      {slide.imagen && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1]" />
      )}

      {/* Contenido */}
      <div className="relative z-10 p-8 md:p-12 w-full">
        {slide.etiqueta && (
          <span
            className="inline-block text-xs font-semibold tracking-widest px-3 py-1 mb-4"
            style={{ backgroundColor: "#FFFFFF", color: slide.color ?? "#D94F35" }}
          >
            {slide.etiqueta}
          </span>
        )}
        <h2
          className="text-white text-3xl md:text-5xl leading-tight max-w-2xl"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {slide.titulo}
        </h2>
        <p className="text-white/70 mt-3 text-sm md:text-base max-w-xl">
          {slide.descripcion}
        </p>
      </div>

      {/* Controles */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3">
        <button
          onClick={prev}
          className="w-9 h-9 border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors text-lg"
          aria-label="Anterior"
        >
          ‹
        </button>
        <span className="text-white/50 text-xs tabular-nums">
          {current + 1} / {slides.length}
        </span>
        <button
          onClick={next}
          className="w-9 h-9 border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors text-lg"
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>
    </div>
  )
}
