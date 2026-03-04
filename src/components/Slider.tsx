"use client"

import { useState, useRef } from "react"
import Image from "next/image"

type Slide = {
  id: string
  titulo: string
  descripcion?: string | null
  etiqueta?: string | null
  imagen?: string | null
  color: string
}

interface SliderProps {
  slides: Slide[]
}

export default function Slider({ slides }: SliderProps) {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)

  if (slides.length === 0) return null

  const slide = slides[current]
  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1))

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) {
      delta > 0 ? next() : prev()
    }
    touchStartX.current = null
  }

  return (
    <div
      className="relative w-full aspect-[4/3] sm:aspect-[16/7] md:aspect-[16/6] overflow-hidden flex items-end"
      style={{ backgroundColor: slide.color, transition: "background-color 0.4s ease" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slide.imagen && (
        <Image src={slide.imagen} alt="" fill className="object-cover" priority />
      )}

      {slide.imagen && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1]" />
      )}

      <div className="relative z-10 p-6 md:p-12 w-full">
        {slide.etiqueta && (
          <span
            className="inline-block text-xs font-semibold tracking-widest px-3 py-1 mb-3"
            style={{ backgroundColor: "#FFFFFF", color: slide.color }}
          >
            {slide.etiqueta}
          </span>
        )}
        <h2
          className="text-white text-2xl sm:text-3xl md:text-5xl leading-tight max-w-2xl"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {slide.titulo}
        </h2>
        {slide.descripcion && (
          <p className="text-white/70 mt-2 text-sm md:text-base max-w-xl">{slide.descripcion}</p>
        )}
      </div>

      {slides.length > 1 && (
        <>
          {/* Puntos — solo móvil */}
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2 md:hidden">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
          {/* Flechas — solo desktop */}
          <div className="absolute bottom-6 right-6 z-10 hidden md:flex items-center gap-3">
            <button
              onClick={prev}
              className="w-11 h-11 border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors text-xl"
              aria-label="Anterior"
            >
              ‹
            </button>
            <span className="text-white/50 text-xs tabular-nums">
              {current + 1} / {slides.length}
            </span>
            <button
              onClick={next}
              className="w-11 h-11 border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors text-xl"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        </>
      )}
    </div>
  )
}
