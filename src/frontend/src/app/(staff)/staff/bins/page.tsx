"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, MapPin, BatteryFull, BatteryMedium, BatteryLow } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";

interface BinData {
  id: string;
  codigo: string;
  ubicacion: string;
  estado: string;
  factor: number;
}

const initialBins: BinData[] = [
  { id: "1", codigo: "BIN-001", ubicacion: "Av. Corrientes 1234", estado: "Activo", factor: 0.10 },
  { id: "2", codigo: "BIN-002", ubicacion: "Av. Santa Fe 567", estado: "Activo", factor: 0.08 },
  { id: "3", codigo: "BIN-003", ubicacion: "Bv. Oroño 890", estado: "Activo", factor: 0.12 },
  { id: "4", codigo: "BIN-004", ubicacion: "Av. Pellegrini 1500", estado: "Mantenimiento", factor: 0.15 },
];

export default function StaffBinsPage() {
  const [bins, setBins] = useState(initialBins);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BinData | null>(null);
  const [form, setForm] = useState({ codigo: "", ubicacion: "", factor: "" });

  const openNew = () => {
    setEditing(null);
    setForm({ codigo: "", ubicacion: "", factor: "" });
    setShowModal(true);
  };

  const openEdit = (bin: BinData) => {
    setEditing(bin);
    setForm({ codigo: bin.codigo, ubicacion: bin.ubicacion, factor: String(bin.factor) });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.codigo || !form.ubicacion || !form.factor) return;
    if (editing) {
      setBins(bins.map((b) => b.id === editing.id ? { ...b, codigo: form.codigo, ubicacion: form.ubicacion, factor: parseFloat(form.factor) } : b));
    } else {
      setBins([...bins, { id: Math.random().toString(), codigo: form.codigo, ubicacion: form.ubicacion, estado: "Activo", factor: parseFloat(form.factor) }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setBins(bins.filter((b) => b.id !== id));
  };

  const statusIcon = (estado: string) => {
    switch (estado) {
      case "Activo": return <BatteryFull size={14} color="#FF3333" aria-hidden="true" />;
      case "Mantenimiento": return <BatteryMedium size={14} color="#888" aria-hidden="true" />;
      default: return <BatteryLow size={14} color="#888" aria-hidden="true" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading text-3xl">Basureros</h1>
        <Button onClick={openNew}>
          <Plus size={16} aria-hidden="true" />
          NUEVO
        </Button>
      </div>

      <div className="border-2 border-ink overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_80px_100px_80px] bg-ink-bg text-white label p-3">
          <span>Código</span>
          <span>Ubicación</span>
          <span>Factor</span>
          <span>Estado</span>
          <span></span>
        </div>

        {bins.map((bin) => (
          <motion.div
            key={bin.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-[1fr_1fr_80px_100px_80px] items-center p-3 border-b border-line font-body text-sm"
          >
            <span className="font-semibold">{bin.codigo}</span>
            <span className="text-mid truncate">{bin.ubicacion}</span>
            <span>{bin.factor}</span>
            <div className="flex items-center gap-1">
              {statusIcon(bin.estado)}
              <span className="text-[10px] uppercase tracking-wider">{bin.estado}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(bin)} className="font-body text-[10px] uppercase tracking-wider underline cursor-pointer bg-transparent border-none text-ink">Editar</button>
              <button onClick={() => handleDelete(bin.id)} className="font-body text-[10px] uppercase tracking-wider underline cursor-pointer bg-transparent border-none text-red">Eliminar</button>
            </div>
          </motion.div>
        ))}

        {bins.length === 0 && (
          <p className="font-body text-sm text-mid text-center py-8">No hay basureros registrados</p>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Editar Basurero" : "Nuevo Basurero"}>
        <div className="flex flex-col gap-4">
          <Input label="Código" placeholder="Ej: BIN-005" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
          <Input label="Ubicación" placeholder="Ej: Av. Siempre Viva 123" value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} />
          <Input label="Factor multiplicador" type="number" step="0.01" placeholder="Ej: 0.10" value={form.factor} onChange={(e) => setForm({ ...form, factor: e.target.value })} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 justify-center">Cancelar</Button>
            <Button onClick={handleSave} className="flex-1 justify-center">{editing ? "GUARDAR" : "CREAR"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
