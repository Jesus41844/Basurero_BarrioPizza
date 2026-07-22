"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trash2, Gift } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const FALLBACK_ITEMS = [
  { id: "1", tipo: "deposito", descripcion: "Royal Blue Plaza, Vía Porras", detalle: "2.3 kg", puntos: 23, fecha: "2026-07-07T14:30:00" },
  { id: "2", tipo: "canje", descripcion: "Pizza Personal", detalle: "Cupón BP-A3F2K1", puntos: -50, fecha: "2026-07-06T18:00:00" },
  { id: "3", tipo: "deposito", descripcion: "Rada Plaza, Costa del Este", detalle: "1.8 kg", puntos: 22, fecha: "2026-07-06T10:15:00" },
  { id: "4", tipo: "deposito", descripcion: "Dorado City Center, El Dorado", detalle: "1.5 kg", puntos: 18, fecha: "2026-07-05T16:45:00" },
  { id: "5", tipo: "canje", descripcion: "Pizza Mediana", detalle: "Cupón BP-X9B7M2", puntos: -100, fecha: "2026-07-04T20:00:00" },
  { id: "6", tipo: "deposito", descripcion: "Plaza Northside, Brisas del Golf", detalle: "3.1 kg", puntos: 47, fecha: "2026-07-03T11:20:00" },
];

type FilterType = "todo" | "deposito" | "canje";

export default function HistoryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const [filter, setFilter] = useState<FilterType>("todo");

  useEffect(() => {
    if (!token) return;
    api.getHistory(token).then(setItems).catch(() => {});
  }, [token]);

  const filtered = filter === "todo" ? items : items.filter((i: any) => i.tipo === filter);

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="heading text-2xl">Historial</h1>
        <div className="flex gap-1">
          {(["todo", "deposito", "canje"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 font-body text-[10px] uppercase tracking-wider cursor-pointer border-2 transition-colors
                ${filter === f ? "bg-ink-bg text-white border-ink" : "bg-transparent text-ink border-ink"}`}
            >
              {f === "todo" ? "Todo" : f === "deposito" ? "Depósitos" : "Canjes"}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="flex flex-col divide-y divide-line">
        {filtered.length === 0 && (
          <p className="font-body text-sm text-mid text-center py-12">No hay actividad registrada</p>
        )}

        {filtered.map((item: any) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 py-3"
          >
            <div className="w-9 h-9 bg-ink-bg flex items-center justify-center shrink-0">
              {item.tipo === "deposito" ? (
                <Trash2 size={16} color="white" aria-hidden="true" />
              ) : (
                <Gift size={16} color="white" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-semibold text-ink truncate">{item.descripcion}</p>
              <p className="font-body text-xs text-mid">
                {item.detalle} &middot; {new Date(item.fecha).toLocaleDateString("es-PA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <span className={`font-heading text-lg ${item.puntos > 0 ? "text-red" : "text-mid"}`}>
              {item.puntos > 0 ? `+${item.puntos}` : item.puntos}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
