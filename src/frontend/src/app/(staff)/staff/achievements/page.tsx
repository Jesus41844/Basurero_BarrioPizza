"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Award, TrendingUp, Trash2, Gift, Star } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";

interface AchievementData {
  id: string;
  nombre: string;
  descripcion: string;
  criterio: string;
  metaValor: number;
  icono: string;
  usuariosCompletados: number;
  activo: boolean;
}

const initialAchievements: AchievementData[] = [
  { id: "1", nombre: "Primer depósito", descripcion: "Realizá tu primer reciclaje", criterio: "depositos", metaValor: 1, icono: "Trash2", usuariosCompletados: 15, activo: true },
  { id: "2", nombre: "10 depósitos", descripcion: "Acumulá 10 reciclajes", criterio: "depositos", metaValor: 10, icono: "TrendingUp", usuariosCompletados: 8, activo: true },
  { id: "3", nombre: "50 kg reciclados", descripcion: "Alcanzá los 50 kg de reciclaje", criterio: "peso", metaValor: 50, icono: "Award", usuariosCompletados: 5, activo: true },
  { id: "4", nombre: "3 canjes", descripcion: "Canjeá 3 cupones", criterio: "canjes", metaValor: 3, icono: "Gift", usuariosCompletados: 4, activo: true },
  { id: "5", nombre: "Reciclador estrella", descripcion: "Reciclá en todos los basureros", criterio: "basureros", metaValor: 4, icono: "Star", usuariosCompletados: 2, activo: false },
];

const iconOptions: Record<string, React.ReactNode> = {
  Trash2: <Trash2 size={18} color="white" />,
  TrendingUp: <TrendingUp size={18} color="white" />,
  Award: <Award size={18} color="white" />,
  Gift: <Gift size={18} color="white" />,
  Star: <Star size={18} color="white" />,
};

export default function StaffAchievementsPage() {
  const [achievements, setAchievements] = useState(initialAchievements);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AchievementData | null>(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "", criterio: "depositos", metaValor: "", icono: "Award" });

  const openNew = () => {
    setEditing(null);
    setForm({ nombre: "", descripcion: "", criterio: "depositos", metaValor: "", icono: "Award" });
    setShowModal(true);
  };

  const openEdit = (a: AchievementData) => {
    setEditing(a);
    setForm({ nombre: a.nombre, descripcion: a.descripcion, criterio: a.criterio, metaValor: String(a.metaValor), icono: a.icono });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.nombre || !form.metaValor) return;
    if (editing) {
      setAchievements(achievements.map((a) => a.id === editing.id ? { ...a, nombre: form.nombre, descripcion: form.descripcion, criterio: form.criterio, metaValor: parseInt(form.metaValor), icono: form.icono } : a));
    } else {
      setAchievements([...achievements, {
        id: Math.random().toString(),
        nombre: form.nombre,
        descripcion: form.descripcion,
        criterio: form.criterio,
        metaValor: parseInt(form.metaValor),
        icono: form.icono,
        usuariosCompletados: 0,
        activo: true,
      }]);
    }
    setShowModal(false);
  };

  const toggleActive = (id: string) => {
    setAchievements(achievements.map((a) => a.id === id ? { ...a, activo: !a.activo } : a));
  };

  const handleDelete = (id: string) => {
    setAchievements(achievements.filter((a) => a.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading text-3xl">Logros</h1>
        <Button onClick={openNew}>
          <Plus size={16} aria-hidden="true" />
          NUEVO
        </Button>
      </div>

      <Card className="mb-6">
        <p className="label mb-1">Resumen</p>
        <p className="font-body text-sm">Total logros: <strong>{achievements.length}</strong> &middot; Activos: <strong>{achievements.filter((a) => a.activo).length}</strong> &middot; Total completados: <strong>{achievements.reduce((s, a) => s + a.usuariosCompletados, 0)}</strong></p>
      </Card>

      <div className="border-2 border-ink overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_1fr_100px_100px_80px_100px] bg-ink-bg text-white label p-3 gap-2">
          <span></span>
          <span>Nombre</span>
          <span>Criterio</span>
          <span>Meta</span>
          <span>Usuarios</span>
          <span>Estado</span>
          <span></span>
        </div>

        {achievements.map((ach) => (
          <motion.div
            key={ach.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid grid-cols-[40px_1fr_1fr_100px_100px_80px_100px] items-center p-3 border-b border-line font-body text-sm gap-2 ${!ach.activo ? "opacity-50" : ""}`}
          >
            <div className="w-8 h-8 bg-ink-bg flex items-center justify-center">
              {iconOptions[ach.icono] || <Award size={18} color="white" />}
            </div>
            <div>
              <span className="font-semibold">{ach.nombre}</span>
              <p className="text-[10px] text-mid">{ach.descripcion}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-mid">{ach.criterio}</span>
            <span className="font-heading">{ach.metaValor}</span>
            <span className="font-heading text-red">{ach.usuariosCompletados}</span>
            <button
              onClick={() => toggleActive(ach.id)}
              className={`px-2 py-1 text-[10px] font-body uppercase tracking-wider cursor-pointer border-2 ${ach.activo ? "bg-red text-white border-red" : "bg-transparent text-mid border-mid"}`}
            >
              {ach.activo ? "Activo" : "Inactivo"}
            </button>
            <div className="flex gap-1">
              <button onClick={() => openEdit(ach)} className="text-[10px] uppercase underline cursor-pointer bg-transparent border-none text-ink">Editar</button>
              <button onClick={() => handleDelete(ach.id)} className="text-[10px] uppercase underline cursor-pointer bg-transparent border-none text-red">Eliminar</button>
            </div>
          </motion.div>
        ))}

        {achievements.length === 0 && (
          <p className="font-body text-sm text-mid text-center py-8">No hay logros creados</p>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Editar Logro" : "Nuevo Logro"}>
        <div className="flex flex-col gap-4">
          <Input label="Nombre" placeholder="Ej: Reciclador experto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <Input label="Descripción" placeholder="Ej: Alcanzá 100 kg reciclados" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />

          <div className="flex flex-col gap-1">
            <label className="label">Criterio</label>
            <select
              value={form.criterio}
              onChange={(e) => setForm({ ...form, criterio: e.target.value })}
              className="border-2 border-ink bg-white text-ink px-3 py-2 font-body text-sm"
            >
              <option value="depositos">Cantidad de depósitos</option>
              <option value="peso">Peso total (kg)</option>
              <option value="canjes">Cantidad de canjes</option>
              <option value="basureros">Basureros distintos</option>
            </select>
          </div>

          <Input label="Valor meta" type="number" placeholder="Ej: 10" value={form.metaValor} onChange={(e) => setForm({ ...form, metaValor: e.target.value })} />

          <div className="flex flex-col gap-1">
            <label className="label">Icono</label>
            <div className="flex gap-2">
              {Object.entries(iconOptions).map(([key, icon]) => (
                <button
                  key={key}
                  onClick={() => setForm({ ...form, icono: key })}
                  className={`w-10 h-10 flex items-center justify-center cursor-pointer border-2 ${form.icono === key ? "bg-ink-bg border-red" : "bg-white border-line"}`}
                  aria-label={key}
                  title={key}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 justify-center">Cancelar</Button>
            <Button onClick={handleSave} className="flex-1 justify-center">{editing ? "GUARDAR" : "CREAR"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
