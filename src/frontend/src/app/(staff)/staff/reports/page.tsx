"use client";

import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Card from "@/components/Card";

const dailyData = [
  { day: "Lun", depositos: 18, peso: 22 },
  { day: "Mar", depositos: 24, peso: 28 },
  { day: "Mié", depositos: 15, peso: 18 },
  { day: "Jue", depositos: 30, peso: 35 },
  { day: "Vie", depositos: 22, peso: 26 },
  { day: "Sáb", depositos: 12, peso: 15 },
  { day: "Dom", depositos: 8, peso: 10 },
];

const weeklyStats = {
  totalDepositos: 129,
  pesoTotal: "154.0 kg",
  puntosEntregados: 4720,
  cuponesCanjeados: 47,
};

export default function StaffReportsPage() {
  return (
    <div>
      <h1 className="heading text-3xl mb-6">Reportes</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <p className="label">Depósitos</p>
            <p className="stat-value text-3xl text-red">{weeklyStats.totalDepositos}</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <p className="label">Peso total</p>
            <p className="stat-value text-3xl text-red">{weeklyStats.pesoTotal}</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <p className="label">Puntos dados</p>
            <p className="stat-value text-3xl text-red">{weeklyStats.puntosEntregados}</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <p className="label">Canjes</p>
            <p className="stat-value text-3xl text-red">{weeklyStats.cuponesCanjeados}</p>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <p className="label mb-4">Depósitos por día</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#111", border: "none", borderRadius: 0, color: "#fff" }}
                labelStyle={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, textTransform: "uppercase" }}
              />
              <Bar dataKey="depositos" fill="#FF3333" barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="label mb-4">Peso reciclado (kg)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF3333" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FF3333" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#111", border: "none", borderRadius: 0, color: "#fff" }}
                labelStyle={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, textTransform: "uppercase" }}
              />
              <Area type="monotone" dataKey="peso" stroke="#FF3333" strokeWidth={2} fill="url(#colorPeso)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
