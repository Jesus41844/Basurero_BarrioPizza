"use client";

import { motion } from "motion/react";
import { Gift, Trash2, TrendingUp, Award } from "lucide-react";
import Card from "@/components/Card";

const stats = [
  { label: "Cupones usados hoy", value: "12", icon: Gift },
  { label: "Total canjes", value: "47", icon: TrendingUp },
  { label: "Basureros activos", value: "10", icon: Trash2 },
  { label: "Logros creados", value: "8", icon: Award },
];

const topCoupons = [
  { name: "Pizza Personal", usos: 18 },
  { name: "Pizza Mediana", usos: 12 },
  { name: "Pizza Familiar", usos: 10 },
  { name: "Combo Familiar", usos: 7 },
];

const binUsage = [
  { codigo: "BIN-001", ubicacion: "Royal Blue Plaza, Vía Porras", usos: 15 },
  { codigo: "BIN-002", ubicacion: "Rada Plaza, Costa del Este", usos: 22 },
  { codigo: "BIN-003", ubicacion: "Dorado City Center, El Dorado", usos: 10 },
  { codigo: "BIN-004", ubicacion: "Plaza Northside, Brisas del Golf", usos: 5 },
];

export default function StaffDashboard() {
  return (
    <div>
      <h1 className="heading text-3xl mb-6">Dashboard Staff</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <s.icon size={20} className="text-red mb-2" aria-hidden="true" />
              <p className="stat-value text-3xl">{s.value}</p>
              <p className="label mt-1">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="heading text-lg mb-3">Cupones más usados</p>
          <div className="border-2 border-ink">
            {topCoupons.map((c, i) => (
              <div key={c.name} className={`flex items-center justify-between px-4 py-3 ${i < topCoupons.length - 1 ? "border-b border-line" : ""}`}>
                <span className="font-body text-sm">{c.name}</span>
                <span className="font-heading text-lg text-red">{c.usos}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="heading text-lg mb-3">Usos por basurero</p>
          <div className="border-2 border-ink">
            {binUsage.map((b, i) => (
              <div key={b.codigo} className={`flex items-center justify-between px-4 py-3 ${i < binUsage.length - 1 ? "border-b border-line" : ""}`}>
                <div>
                  <span className="font-body text-sm">{b.ubicacion}</span>
                  <p className="font-body text-[10px] text-mid">{b.codigo}</p>
                </div>
                <span className="font-heading text-lg text-red">{b.usos}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
