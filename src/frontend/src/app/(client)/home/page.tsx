"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "motion/react";
import { TrendingUp, Gift, Trash2, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import Card from "@/components/Card";
import Button from "@/components/Button";

const weekData = [
  { day: "L", kg: 2.5 }, { day: "M", kg: 3.2 }, { day: "X", kg: 1.8 },
  { day: "J", kg: 4.1 }, { day: "V", kg: 3.5 }, { day: "S", kg: 5.2 }, { day: "D", kg: 2.9 },
];

const recentActivity = [
  { id: "1", action: "Depósito", loc: "Royal Blue Plaza, Vía Porras", weight: "2.3 kg", pts: "+23", time: "Hace 2 h" },
  { id: "2", action: "Canje", loc: "Pizza Personal", pts: "-50", time: "Ayer" },
  { id: "3", action: "Depósito", loc: "Dorado City Center, El Dorado", weight: "1.8 kg", pts: "+22", time: "Ayer" },
];

export default function HomePage() {
  const { user, token, refreshUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const [stats, setStats] = useState({ depositos: 0, peso: 0 });
  useEffect(() => {
    if (!token) return;
    api.getWallet(token).then((d) => {
      if (d.usuario) setStats({ depositos: 0, peso: 0 });
    }).catch(() => {});
  }, [token]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
        <div className="mb-6">
          <p className="label">Tus EcoRewards</p>
          <h2 className="heading text-[56px] leading-none mt-1">{user?.puntos ?? 0}</h2>
          <p className="font-body text-sm text-mid mt-1">
            Hola, {user?.nombre ?? "Usuario"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <p className="label">Depósitos</p>
            <p className="stat-value text-3xl mt-1">142</p>
            <p className="font-body text-xs text-mid mt-1">Esta semana</p>
          </Card>
          <Card>
            <p className="label">Peso total</p>
            <p className="stat-value text-3xl mt-1">52.3 kg</p>
            <p className="font-body text-xs text-mid mt-1">Esta semana</p>
          </Card>
        </div>

        <Card className="mb-6">
          <p className="label mb-3">Actividad semanal</p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={weekData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF3333" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FF3333" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: "#111", border: "none", borderRadius: 0, color: "#fff" }}
                labelStyle={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, textTransform: "uppercase" }}
              />
              <Area type="monotone" dataKey="kg" stroke="#FF3333" strokeWidth={2} fill="url(#colorKg)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-2">
            {weekData.map((d) => (
              <span key={d.day} className="font-body text-[10px] text-mid uppercase tracking-wider">{d.day}</span>
            ))}
          </div>
        </Card>

        <Link href="/scan" className="no-underline block mb-6">
          <Button variant="primary" className="w-full justify-center text-base py-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 12h10M12 7v10" />
            </svg>
            ESCANEAR QR
          </Button>
        </Link>

        <div className="mb-6">
          <p className="label mb-3">Actividad reciente</p>
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3 border-b border-line">
              <div className="w-9 h-9 bg-ink-bg flex items-center justify-center shrink-0">
                {item.action === "Depósito" ? (
                  <Trash2 size={16} color="white" aria-hidden="true" />
                ) : (
                  <Gift size={16} color="white" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-ink truncate">{item.loc}</p>
                <p className="font-body text-xs text-mid">{item.time}</p>
              </div>
              <span className={cn("font-heading text-lg", item.pts.startsWith("+") ? "text-red" : "text-mid")}>
                {item.pts}
              </span>
            </div>
          ))}
        </div>

        <div>
          <p className="label mb-3">Logros</p>
          <div className="flex gap-3">
            <Card className="flex-1 text-center">
              <Award size={28} className="mx-auto mb-2 text-ink" aria-hidden="true" />
              <p className="font-body text-[10px] uppercase tracking-wider text-mid">10 depósitos</p>
            </Card>
            <Card className="flex-1 text-center opacity-50">
              <TrendingUp size={28} className="mx-auto mb-2 text-ink" aria-hidden="true" />
              <p className="font-body text-[10px] uppercase tracking-wider text-mid">50 kg</p>
            </Card>
            <Card className="flex-1 text-center opacity-50">
              <Gift size={28} className="mx-auto mb-2 text-ink" aria-hidden="true" />
              <p className="font-body text-[10px] uppercase tracking-wider text-mid">3 canjes</p>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


