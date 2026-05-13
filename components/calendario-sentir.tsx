"use client"

import { useState } from "react"

const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

const DAYS_ES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"]

interface EventTypeConfig {
  bg: string
  text: string
  dotBg: string
  label: string
  fireIcon?: boolean
}

const EVENT_TYPES: Record<string, EventTypeConfig> = {
  autoconocimiento: {
    bg: "bg-teal-500",
    text: "text-white",
    dotBg: "bg-teal-500",
    label: "Autoconocimiento",
  },
  transformacion: {
    bg: "bg-blue-600",
    text: "text-white",
    dotBg: "bg-blue-600",
    label: "Transformación",
  },
  guerrero: {
    bg: "bg-gray-800",
    text: "text-white",
    dotBg: "bg-gray-800",
    label: "Camino del Guerrero",
    fireIcon: true,
  },
  biodecodificacion: {
    bg: "bg-violet-600",
    text: "text-white",
    dotBg: "bg-violet-600",
    label: "Biodecodificación",
  },
  nino: {
    bg: "bg-sky-400",
    text: "text-white",
    dotBg: "bg-sky-400",
    label: "Niño Interior",
  },
  leyes: {
    bg: "bg-purple-600",
    text: "text-white",
    dotBg: "bg-purple-600",
    label: "7 Leyes Universales",
  },
  oratoria: {
    bg: "bg-orange-500",
    text: "text-white",
    dotBg: "bg-orange-500",
    label: "Oratoria",
  },
  myl: {
    bg: "bg-amber-800",
    text: "text-white",
    dotBg: "bg-amber-800",
    label: "MyL 7",
  },
}

type EventType = keyof typeof EVENT_TYPES

interface DayEvent {
  month: number
  day: number
  type: EventType
  label: string
}

const CALENDAR_EVENTS: DayEvent[] = [
  // ── EVENTOS REALIZADOS ──────────────────────────────────────

  // Enero — Autoconocimiento Río Gallegos (realizado)
  { month: 0, day: 23, type: "autoconocimiento", label: "Autocon. – Río Gallegos" },
  { month: 0, day: 24, type: "autoconocimiento", label: "Autocon. – Río Gallegos" },
  { month: 0, day: 25, type: "autoconocimiento", label: "Autocon. – Río Gallegos" },

  // Febrero — Camino del Guerrero Río Gallegos (realizado)
  { month: 1, day: 14, type: "guerrero", label: "Camino del Guerrero – Río Gallegos" },
  { month: 1, day: 15, type: "guerrero", label: "Camino del Guerrero – Río Gallegos" },

  // Marzo — Biodecodificación (realizado)
  { month: 2, day: 7, type: "biodecodificacion", label: "Taller de Biodecodificación" },

  // Marzo — Niño Interior (realizado)
  { month: 2, day: 8, type: "nino", label: "Taller Niño Interior" },

  // Marzo — Autoconocimiento Río Gallegos (realizado)
  { month: 2, day: 13, type: "autoconocimiento", label: "Autocon. – Río Gallegos" },
  { month: 2, day: 14, type: "autoconocimiento", label: "Autocon. – Río Gallegos" },
  { month: 2, day: 15, type: "autoconocimiento", label: "Autocon. – Río Gallegos" },

  // Abril — Autoconocimiento Tandil (realizado)
  { month: 3, day: 10, type: "autoconocimiento", label: "Autocon. – Tandil" },
  { month: 3, day: 11, type: "autoconocimiento", label: "Autocon. – Tandil" },
  { month: 3, day: 12, type: "autoconocimiento", label: "Autocon. – Tandil" },

  // Abril — Autoconocimiento Necochea (realizado)
  { month: 3, day: 17, type: "autoconocimiento", label: "Autocon. – Necochea" },
  { month: 3, day: 18, type: "autoconocimiento", label: "Autocon. – Necochea" },
  { month: 3, day: 19, type: "autoconocimiento", label: "Autocon. – Necochea" },

  // Mayo — Autoconocimiento Río Gallegos (realizado)
  { month: 4, day: 8, type: "autoconocimiento", label: "Autocon. – Río Gallegos" },
  { month: 4, day: 9, type: "autoconocimiento", label: "Autocon. – Río Gallegos" },
  { month: 4, day: 10, type: "autoconocimiento", label: "Autocon. – Río Gallegos" },

  // ── PRÓXIMOS EVENTOS ────────────────────────────────────────

  // Marzo — Autoconocimiento Punta Arenas
  { month: 2, day: 27, type: "autoconocimiento", label: "Autocon. – Punta Arenas" },
  { month: 2, day: 28, type: "autoconocimiento", label: "Autocon. – Punta Arenas" },
  { month: 2, day: 29, type: "autoconocimiento", label: "Autocon. – Punta Arenas" },

  // Abril — Transformación Río Gallegos
  { month: 3, day: 2, type: "transformacion", label: "Transfor. – Río Gallegos" },
  { month: 3, day: 3, type: "transformacion", label: "Transfor. – Río Gallegos" },
  { month: 3, day: 4, type: "transformacion", label: "Transfor. – Río Gallegos" },
  { month: 3, day: 5, type: "transformacion", label: "Transfor. – Río Gallegos" },

  // Mayo — Las 7 Leyes Universales
  { month: 4, day: 11, type: "leyes", label: "Las 7 Leyes Universales" },
  { month: 4, day: 13, type: "leyes", label: "Las 7 Leyes Universales" },
  { month: 4, day: 15, type: "leyes", label: "Las 7 Leyes Universales" },
  { month: 4, day: 18, type: "leyes", label: "Las 7 Leyes Universales" },
  { month: 4, day: 20, type: "leyes", label: "Las 7 Leyes Universales" },
  { month: 4, day: 22, type: "leyes", label: "Las 7 Leyes Universales" },
  { month: 4, day: 25, type: "leyes", label: "Las 7 Leyes Universales" },

  // Mayo — Oratoria Online
  { month: 4, day: 12, type: "oratoria", label: "Curso de Oratoria Online" },
  { month: 4, day: 14, type: "oratoria", label: "Curso de Oratoria Online" },
  { month: 4, day: 19, type: "oratoria", label: "Curso de Oratoria Online" },
  { month: 4, day: 21, type: "oratoria", label: "Curso de Oratoria Online" },
  { month: 4, day: 26, type: "oratoria", label: "Curso de Oratoria Online" },

  // Mayo — Camino del Guerrero Río Gallegos
  { month: 4, day: 16, type: "guerrero", label: "Camino del Guerrero – Río Gallegos" },
  { month: 4, day: 17, type: "guerrero", label: "Camino del Guerrero – Río Gallegos" },

  // Mayo — Camino del Guerrero Punta Arenas
  { month: 4, day: 23, type: "guerrero", label: "Camino del Guerrero – Punta Arenas" },
  { month: 4, day: 24, type: "guerrero", label: "Camino del Guerrero – Punta Arenas" },

  // Junio — Biodecodificación
  { month: 5, day: 13, type: "biodecodificacion", label: "Taller de Biodecodificación" },

  // Junio — Niño Interior
  { month: 5, day: 14, type: "nino", label: "Taller Sanando mi Niño Interior" },

  // Julio — Transformación
  { month: 6, day: 9, type: "transformacion", label: "Transfor." },
  { month: 6, day: 10, type: "transformacion", label: "Transfor." },
  { month: 6, day: 11, type: "transformacion", label: "Transfor." },
  { month: 6, day: 12, type: "transformacion", label: "Transfor." },

  // Agosto — MyL 7 · 1ra Sala
  { month: 7, day: 8, type: "myl", label: "MyL 7 - 1ra Sala." },
  { month: 7, day: 9, type: "myl", label: "MyL 7 - 1ra Sala." },

  // Agosto — MyL 7 · 2da Sala
  { month: 7, day: 29, type: "myl", label: "MyL 7 - 2da Sala." },
  { month: 7, day: 30, type: "myl", label: "MyL 7 - 2da Sala." },

  // Septiembre — Autoconocimiento Córdoba
  { month: 8, day: 25, type: "autoconocimiento", label: "Autocon. – Córdoba" },
  { month: 8, day: 26, type: "autoconocimiento", label: "Autocon. – Córdoba" },
  { month: 8, day: 27, type: "autoconocimiento", label: "Autocon. – Córdoba" },

  // Octubre — Autoconocimiento El Calafate
  { month: 9, day: 9, type: "autoconocimiento", label: "Autocon. – El Calafate" },
  { month: 9, day: 10, type: "autoconocimiento", label: "Autocon. – El Calafate" },
  { month: 9, day: 11, type: "autoconocimiento", label: "Autocon. – El Calafate" },

  // Octubre/Noviembre — MyL 7 · Campamento y Cierre
  { month: 9, day: 31, type: "myl", label: "MyL 7 - Campamento y Cierre" },
  { month: 10, day: 1, type: "myl", label: "MyL 7 - Campamento y Cierre" },

  // Noviembre — Camino del Guerrero Quequén/Necochea
  { month: 10, day: 7, type: "guerrero", label: "Camino del Guerrero – Quequén/Necochea" },
  { month: 10, day: 8, type: "guerrero", label: "Camino del Guerrero – Quequén/Necochea" },

  // Noviembre — Autoconocimiento Quequén/Necochea
  { month: 10, day: 13, type: "autoconocimiento", label: "Autocon. – Quequén/Necochea" },
  { month: 10, day: 14, type: "autoconocimiento", label: "Autocon. – Quequén/Necochea" },
  { month: 10, day: 15, type: "autoconocimiento", label: "Autocon. – Quequén/Necochea" },

  // Diciembre — Autoconocimiento CABA
  { month: 11, day: 4, type: "autoconocimiento", label: "Autocon. – CABA" },
  { month: 11, day: 5, type: "autoconocimiento", label: "Autocon. – CABA" },
  { month: 11, day: 6, type: "autoconocimiento", label: "Autocon. – CABA" },
]

function getFirstWeekday(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return (day + 6) % 7
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function isPastDate(year: number, month: number, day: number): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(year, month, day) < today
}

interface TooltipState {
  visible: boolean
  label: string
  x: number
  y: number
}

function MonthCalendar({
  year,
  monthIndex,
  events,
  onDayHover,
}: {
  year: number
  monthIndex: number
  events: DayEvent[]
  onDayHover: (state: TooltipState) => void
}) {
  const firstDay = getFirstWeekday(year, monthIndex)
  const totalDays = getDaysInMonth(year, monthIndex)

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function getEventsForDay(day: number) {
    return events.filter((e) => e.month === monthIndex && e.day === day)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-sm flex-1 min-w-0">
      <h3 className="text-center font-semibold text-sm mb-2 text-foreground">
        {MONTHS_ES[monthIndex]}
      </h3>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_ES.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const dayEvents = day ? getEventsForDay(day) : []
          const hasEvent = dayEvents.length > 0
          const evType = hasEvent ? EVENT_TYPES[dayEvents[0].type] : null
          const showFire = hasEvent && evType?.fireIcon
          const isPast = day ? isPastDate(year, monthIndex, day) : false

          return (
            <div
              key={idx}
              className={`relative flex flex-col items-center justify-center rounded-full aspect-square text-[11px] font-medium transition-all cursor-default select-none mx-px my-px
                ${!day ? "invisible" : ""}
                ${hasEvent ? `${evType!.bg} ${evType!.text} shadow-sm scale-105` : "hover:bg-muted text-foreground"}
              `}
              title={hasEvent ? dayEvents.map((e) => e.label).join(", ") : undefined}
              onMouseEnter={(e) => {
                if (!hasEvent) return
                const rect = e.currentTarget.getBoundingClientRect()
                onDayHover({
                  visible: true,
                  label: dayEvents.map((e) => e.label).join(" · "),
                  x: rect.left + rect.width / 2,
                  y: rect.top - 8,
                })
              }}
              onMouseLeave={() => onDayHover({ visible: false, label: "", x: 0, y: 0 })}
            >
              {showFire ? (
                <>
                  <span className="leading-none text-[10px]">{day}</span>
                  {isPast
                    ? <span className="leading-none text-[10px] font-bold">✓</span>
                    : <img src="/fuego-de-sentir.png" alt="" className="w-3 h-3 object-contain" />
                  }
                </>
              ) : hasEvent && isPast ? (
                <>
                  <span className="leading-none text-[10px]">{day}</span>
                  <span className="leading-none text-[10px] font-bold">✓</span>
                </>
              ) : (
                day
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function CalendarioSentir() {
  const year = 2026
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, label: "", x: 0, y: 0 })

  const rows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
  ]

  return (
    <section className="py-12 sm:py-16 w-full" id="calendario-sentir">
      {/* Global tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none bg-foreground text-background text-xs px-2 py-1 rounded-md shadow-lg -translate-x-1/2 -translate-y-full whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.label}
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 text-balance">
            Calendario Sentir 2026
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Todos los eventos del año marcados en el calendario
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 mb-8">
          {Object.entries(EVENT_TYPES).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`inline-block w-5 h-5 rounded-full flex-shrink-0 ${val.dotBg}`} />
              {val.fireIcon && (
                <img src="/fuego-de-sentir.png" alt="" className="w-5 h-5 object-contain -ml-1" />
              )}
              <span className="text-base sm:text-lg font-medium text-foreground">{val.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid — 3 months per row */}
        <div className="space-y-4">
          {rows.map((group, rowIdx) => (
            <div key={rowIdx} className="flex gap-3 sm:gap-4">
              {group.map((monthIndex) => (
                <MonthCalendar
                  key={monthIndex}
                  year={year}
                  monthIndex={monthIndex}
                  events={CALENDAR_EVENTS}
                  onDayHover={setTooltip}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
