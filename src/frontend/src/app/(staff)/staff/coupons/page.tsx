"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Gift, EyeOff } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";

interface CouponData {
  id: string;
  codigo: string;
  descripcion: string;
  costoPuntos: number;
  activo: boolean;
}

const existingCoupons: CouponData[] = [
  { id: "1", codigo: "PIZZA-PERSONAL", descripcion: "Pizza Personal 1 Ingrediente", costoPuntos: 50, activo: true },
  { id: "2", codigo: "PIZZA-MEDIANA", descripcion: "Pizza Mediana 2 Ingredientes", costoPuntos: 100, activo: true },
  { id: "3", codigo: "PIZZA-FAMILIAR", descripcion: "Pizza Familiar 3 Ingredientes + Bebida 2L", costoPuntos: 200, activo: true },
  { id: "4", codigo: "COMBO-FAMILIAR", descripcion: "Combo Familiar 2 Pizzas + 2 Bebidas", costoPuntos: 350, activo: true },
];

export default function StaffCouponsPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ codigo: "", descripcion: "", costoPuntos: "", reglas: "" });
  const [coupons, setCoupons] = useState(existingCoupons);

  const handleCreate = () => {
    if (!form.codigo || !form.descripcion || !form.costoPuntos) return;
    const nuevo: CouponData = {
      id: Math.random().toString(),
      codigo: form.codigo,
      descripcion: form.descripcion,
      costoPuntos: parseInt(form.costoPuntos),
      activo: true,
    };
    setCoupons([nuevo, ...coupons]);
    setForm({ codigo: "", descripcion: "", costoPuntos: "", reglas: "" });
    setShowModal(false);
  };

  const toggleActive = (id: string) => {
    setCoupons(coupons.map((c) => c.id === id ? { ...c, activo: !c.activo } : c));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading text-3xl">Cupones</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} aria-hidden="true" />
          NUEVO
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {coupons.map((cupon) => (
          <motion.div key={cupon.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={!cupon.activo ? "opacity-50" : ""}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ink-bg flex items-center justify-center shrink-0">
                  <Gift size={22} color="white" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold">{cupon.descripcion}</p>
                  <p className="label mt-1">{cupon.codigo} &middot; {cupon.costoPuntos} pts</p>
                </div>
                <div className="flex gap-2">
                  {!cupon.activo && <EyeOff size={18} className="text-mid" aria-label="Desactivado" />}
                  <button
                    onClick={() => toggleActive(cupon.id)}
                    className={`px-2 py-1 text-[10px] font-body uppercase tracking-wider cursor-pointer border-2 transition-colors
                      ${cupon.activo ? "bg-red text-white border-red" : "bg-transparent text-mid border-mid"}`}
                  >
                    {cupon.activo ? "Activo" : "Inactivo"}
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo Cupón">
        <div className="flex flex-col gap-4">
          <Input label="Código" placeholder="Ej: PIZZA-ESPECIAL" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
          <Input label="Descripción" placeholder="Ej: Pizza Especial 3 Ingredientes" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          <Input label="Costo en puntos" type="number" placeholder="Ej: 150" value={form.costoPuntos} onChange={(e) => setForm({ ...form, costoPuntos: e.target.value })} />
          <Input label="Reglas (opcional)" placeholder="Ej: Válido hasta fin de mes" value={form.reglas} onChange={(e) => setForm({ ...form, reglas: e.target.value })} />
          <Button onClick={handleCreate} className="w-full justify-center">
            CREAR CUPÓN
          </Button>
        </div>
      </Modal>
    </div>
  );
}
