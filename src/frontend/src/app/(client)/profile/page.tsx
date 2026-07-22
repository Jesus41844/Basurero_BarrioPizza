"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Award, TrendingUp, Gift, Trash2, LogOut, Shield, Star, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/lib/api";
import Card from "@/components/Card";
import Button from "@/components/Button";

const iconMap: Record<string, React.ReactNode> = {
  Trash2: <Trash2 size={18} color="white" />,
  TrendingUp: <TrendingUp size={18} color="white" />,
  Award: <Award size={18} color="white" />,
  Gift: <Gift size={18} color="white" />,
  Star: <Star size={18} color="white" />,
};

const FALLBACK_ACHIEVEMENTS = [
  { id: "1", nombre: "10 depósitos", icono: "Trash2", progreso: 7, metaValor: 10, completado: false },
  { id: "2", nombre: "50 kg reciclados", icono: "TrendingUp", progreso: 52, metaValor: 50, completado: true },
  { id: "3", nombre: "3 canjes", icono: "Gift", progreso: 2, metaValor: 3, completado: false },
];

export default function ProfilePage() {
  const { user, token, isStaff, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [achievements, setAchievements] = useState(FALLBACK_ACHIEVEMENTS);

  useEffect(() => {
    refreshUser();
    if (!token) return;
    api.getAchievements(token).then(setAchievements).catch(() => {});
  }, [token, refreshUser]);

  const initial = user?.nombre?.charAt(0)?.toUpperCase() ?? "?";

  const { dark, toggle } = useTheme();

  return (
    <div className="max-w-lg mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-ink-bg flex items-center justify-center">
            <span className="font-heading text-3xl text-white">{initial}</span>
          </div>
          <div className="flex-1">
            <h1 className="heading text-2xl">{user?.nombre ?? "Usuario"}</h1>
            <p className="font-body text-sm text-mid">{user?.email}</p>
          </div>
          <button
            onClick={toggle}
            aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
            className="w-10 h-10 bg-ink-bg flex items-center justify-center cursor-pointer border-none"
          >
            {dark ? <Sun size={18} color="white" /> : <Moon size={18} color="white" />}
          </button>
        </div>

        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="label">EcoRewards</p>
              <p className="heading text-4xl text-red mt-1">{user?.puntos ?? 0}</p>
            </div>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF3333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </Card>

        <div className="mb-6">
          <p className="label mb-3">Logros</p>
          <div className="flex flex-col gap-2">
            {achievements.map((ach: any) => (
              <div key={ach.id} className="flex items-center gap-3 py-2">
                <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${ach.completado ? "bg-red" : "bg-ink-bg"}`}>
                  {iconMap[ach.icono] || <Award size={18} color="white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-ink">{ach.nombre}</p>
                  <div className="h-1 bg-line mt-1 relative">
                    <div
                      className="h-full bg-red transition-all"
                      style={{ width: `${Math.min(100, (ach.progreso / ach.metaValor) * 100)}%` }}
                    />
                  </div>
                  <p className="font-body text-[10px] text-mid mt-0.5">
                    {ach.progreso}/{ach.metaValor}
                  </p>
                </div>
                {ach.completado && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF3333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {isStaff && (
          <Card className="mb-6 cursor-pointer" onClick={() => router.push("/staff")}>
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-ink" aria-hidden="true" />
              <div>
                <p className="font-body text-sm font-semibold text-ink">Panel Staff</p>
                <p className="font-body text-[10px] text-mid uppercase tracking-wider">Validar cupones, crear logros, reportes</p>
              </div>
            </div>
          </Card>
        )}

        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={() => { logout(); router.push("/auth"); }}
        >
          <LogOut size={16} aria-hidden="true" />
          CERRAR SESIÓN
        </Button>
      </motion.div>
    </div>
  );
}
