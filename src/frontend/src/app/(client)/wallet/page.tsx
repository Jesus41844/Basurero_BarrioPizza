"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Gift, Plus, Minus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

interface CuponData {
  id: string;
  codigo: string;
  descripcion: string;
  costoPuntos: number;
  activo: boolean;
}

interface CanjeData {
  id: string;
  codigoUnico: string;
  cuponId: string;
  createdAt: string;
  estado: string;
}

const FALLBACK_COUPONS: CuponData[] = [
  { id: "1", codigo: "PIZZA-PERSONAL", descripcion: "Pizza Personal 1 Ingrediente", costoPuntos: 50, activo: true },
  { id: "2", codigo: "PIZZA-MEDIANA", descripcion: "Pizza Mediana 2 Ingredientes", costoPuntos: 100, activo: true },
  { id: "3", codigo: "PIZZA-FAMILIAR", descripcion: "Pizza Familiar 3 Ingredientes + Bebida 2L", costoPuntos: 200, activo: true },
  { id: "4", codigo: "COMBO-FAMILIAR", descripcion: "Combo Familiar 2 Pizzas + 2 Bebidas", costoPuntos: 350, activo: true },
];

const FALLBACK_TX = [
  { id: "1", tipo: "deposito", desc: "Royal Blue Plaza, Vía Porras", puntos: 23, fecha: "2026-07-07T14:30:00" },
  { id: "2", tipo: "canje", desc: "Pizza Personal", puntos: -50, fecha: "2026-07-06T18:00:00" },
];

export default function WalletPage() {
  const { user, token, refreshUser } = useAuth();
  const [tab, setTab] = useState<"transacciones" | "recompensas">("recompensas");
  const [cupones, setCupones] = useState<CuponData[]>(FALLBACK_COUPONS);
  const [transacciones, setTransacciones] = useState(FALLBACK_TX);
  const [selectedCupon, setSelectedCupon] = useState<CuponData | null>(null);
  const [canjeResult, setCanjeResult] = useState<CanjeData | null>(null);
  const [loadingCanje, setLoadingCanje] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.getWallet(token).then((d) => {
      if (d.cupones?.length) setCupones(d.cupones);
    }).catch(() => {});
    api.getHistory(token).then(setTransacciones).catch(() => {});
    refreshUser();
  }, [token, refreshUser]);

  const handleCanje = async () => {
    if (!selectedCupon || !token) return;
    setLoadingCanje(true);
    try {
      const data = await api.redeem(token, selectedCupon.id);
      setCanjeResult({
        id: Math.random().toString(),
        codigoUnico: data.codigo,
        cuponId: selectedCupon.id,
        createdAt: new Date().toISOString(),
        estado: "activo",
      });
      refreshUser();
    } catch (err: any) {
      setCanjeResult({
        id: "error",
        codigoUnico: err.message,
        cuponId: selectedCupon.id,
        createdAt: new Date().toISOString(),
        estado: "error",
      });
    } finally {
      setLoadingCanje(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
        <Card className="mb-6 text-center">
          <p className="label">Saldo disponible</p>
          <p className="heading text-[64px] leading-none mt-1 text-red">{user?.puntos ?? 0}</p>
          <p className="font-body text-xs text-mid mt-1">EcoRewards</p>
        </Card>

        <div className="flex border-2 border-ink mb-6" role="tablist" aria-label="Secciones">
          <button
            role="tab"
            aria-selected={tab === "recompensas"}
            onClick={() => setTab("recompensas")}
            className={`flex-1 py-3 font-heading text-sm tracking-wider uppercase cursor-pointer ${
              tab === "recompensas" ? "bg-ink-bg text-white" : "bg-transparent text-ink"
            }`}
          >
            Recompensas
          </button>
          <button
            role="tab"
            aria-selected={tab === "transacciones"}
            onClick={() => setTab("transacciones")}
            className={`flex-1 py-3 font-heading text-sm tracking-wider uppercase cursor-pointer ${
              tab === "transacciones" ? "bg-ink-bg text-white" : "bg-transparent text-ink"
            }`}
          >
            Historial
          </button>
        </div>

        {tab === "recompensas" && (
          <div className="flex flex-col gap-3">
            {cupones.filter((c) => c.activo !== false).map((cupon) => (
              <Card key={cupon.id}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-ink-bg flex items-center justify-center shrink-0">
                    <Gift size={22} color="white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-lg">{cupon.descripcion}</p>
                    <p className="label mt-1">{cupon.costoPuntos} pts</p>
                  </div>
                  <Button
                    variant={user && user.puntos >= cupon.costoPuntos ? "primary" : "ghost"}
                    disabled={!user || user.puntos < cupon.costoPuntos}
                    onClick={() => setSelectedCupon(cupon)}
                    className="text-xs px-4 py-2"
                  >
                    CANJEAR
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "transacciones" && (
          <div>
            {transacciones.length === 0 && <p className="font-body text-sm text-mid text-center py-8">Sin transacciones aún</p>}
            {transacciones.map((tx: any) => (
              <div key={tx.id} className="flex items-center gap-3 py-3 border-b border-line">
                <div className="w-9 h-9 bg-ink-bg flex items-center justify-center shrink-0">
                  {tx.tipo === "deposito" ? (
                    <Plus size={16} color="white" aria-hidden="true" />
                  ) : (
                    <Minus size={16} color="white" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-ink truncate">{tx.descripcion || tx.desc}</p>
                  <p className="font-body text-xs text-mid">
                    {new Date(tx.fecha).toLocaleDateString("es-PA", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <span className={`font-heading text-lg ${tx.puntos > 0 ? "text-red" : "text-mid"}`}>
                  {tx.puntos > 0 ? `+${tx.puntos}` : tx.puntos}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <Modal open={!!selectedCupon} onClose={() => { setSelectedCupon(null); setCanjeResult(null); }} title="Confirmar Canje">
        {canjeResult ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-ink-bg flex items-center justify-center mx-auto mb-4">
              <Gift size={32} color="#FF3333" aria-hidden="true" />
            </div>
            <p className="font-body text-sm mb-2">¡Cupón generado!</p>
            <p className="font-heading text-2xl tracking-widest text-red">{canjeResult.codigoUnico}</p>
            <p className="font-body text-xs text-mid mt-2">Presentá este código en el local</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-body text-sm mb-4">
              Canjear <strong>{selectedCupon?.descripcion}</strong> por{" "}
              <strong className="text-red">{selectedCupon?.costoPuntos} pts</strong>
            </p>
            <Button onClick={handleCanje} loading={loadingCanje} className="w-full justify-center">
              CONFIRMAR CANJE
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
