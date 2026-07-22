"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { MapPin, Clock, BatteryFull, BatteryMedium } from "lucide-react";
import { api } from "@/lib/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface BinLocation {
  id: string;
  codigo: string;
  ubicacion: string;
  estado: string;
  factorMultiplicador: number;
  lat?: number;
  lng?: number;
  horario?: string;
  telefono?: string;
}

const FALLBACK_BINS: BinLocation[] = [
  { id: "1", codigo: "BIN-001", ubicacion: "Royal Blue Plaza, Vía Porras", estado: "Activo", factorMultiplicador: 0.10, lat: 8.993756, lng: -79.515870, horario: "11:00–22:00" },
  { id: "2", codigo: "BIN-002", ubicacion: "Rada Plaza, Costa del Este", estado: "Activo", factorMultiplicador: 0.10, lat: 9.015339, lng: -79.477603, horario: "11:00–22:00" },
  { id: "3", codigo: "BIN-003", ubicacion: "Dorado City Center, El Dorado", estado: "Activo", factorMultiplicador: 0.10, lat: 9.015096, lng: -79.534847, horario: "11:00–22:00" },
  { id: "4", codigo: "BIN-004", ubicacion: "Plaza Northside, Brisas del Golf", estado: "Activo", factorMultiplicador: 0.10, lat: 9.049170, lng: -79.459000, horario: "11:00–22:00" },
  { id: "5", codigo: "BIN-005", ubicacion: "Punto Marbella, Vía España", estado: "Activo", factorMultiplicador: 0.10, lat: 8.995000, lng: -79.512000, horario: "11:00–22:00" },
  { id: "6", codigo: "BIN-006", ubicacion: "Vía Argentina, El Cangrejo", estado: "Activo", factorMultiplicador: 0.10, lat: 8.980200, lng: -79.522700, horario: "11:00–22:00" },
  { id: "7", codigo: "BIN-007", ubicacion: "Clayton, Ciudad del Saber", estado: "Activo", factorMultiplicador: 0.10, lat: 8.983400, lng: -79.558400, horario: "11:00–21:00" },
  { id: "8", codigo: "BIN-008", ubicacion: "Market Plaza, La Chorrera", estado: "Activo", factorMultiplicador: 0.10, lat: 8.879800, lng: -79.781700, horario: "11:00–21:00" },
  { id: "9", codigo: "BIN-009", ubicacion: "Plaza El Sol, Colón", estado: "Activo", factorMultiplicador: 0.10, lat: 9.354700, lng: -79.900000, horario: "11:00–21:00" },
  { id: "10", codigo: "BIN-010", ubicacion: "Aeropuerto Tocumen", estado: "Activo", factorMultiplicador: 0.10, lat: 9.071200, lng: -79.383500, horario: "06:00–22:00" },
];

function createMarkerIcon(color: string) {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>`,
    className: "",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

export default function MapPage() {
  const [bins, setBins] = useState<BinLocation[]>(FALLBACK_BINS);
  const [selected, setSelected] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    api.getBinLocations().then((data) => {
      if (data && data.length > 0 && data[0].lat != null) setBins(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [8.98, -79.52],
      zoom: 12,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://openstreetmap.org">OSM</a>',
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapInstance.current = map;

    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    bins.forEach((bin) => {
      if (bin.lat == null || bin.lng == null) return;

      const marker = L.marker([bin.lat, bin.lng], {
        icon: createMarkerIcon(bin.estado === "Activo" ? "#FF3333" : "#666666"),
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;font-size:12px;line-height:1.5;min-width:180px">
          <strong style="font-family:'Barlow Condensed',sans-serif;font-size:16px;text-transform:uppercase;letter-spacing:0.05em">${bin.codigo}</strong>
          <p style="margin:6px 0 4px;color:#555">${bin.ubicacion}</p>
          ${bin.horario ? `<p style="margin:2px 0;color:#555">🕐 ${bin.horario}</p>` : ""}
          ${bin.telefono ? `<p style="margin:2px 0;color:#555">📞 ${bin.telefono}</p>` : ""}
          <p style="margin:6px 0 0;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:${bin.estado === "Activo" ? "#FF3333" : "#888"}">${bin.estado}</p>
        </div>
      `);

      marker.on("click", () => setSelected(bin.id));
      markersRef.current.push(marker);
    });

    if (bins.length > 0) {
      const valid = bins.filter((b) => b.lat != null);
      if (valid.length > 0) {
        const lats = valid.map((b) => b.lat!);
        const lngs = valid.map((b) => b.lng!);
        map.fitBounds(
          [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]],
          { padding: [40, 40] }
        );
      }
    }
  }, [bins]);

  useEffect(() => {
    if (!selected || !mapInstance.current) return;
    const bin = bins.find((b) => b.id === selected);
    if (bin?.lat != null && bin.lng != null) {
      mapInstance.current.setView([bin.lat, bin.lng], 15);
    }
  }, [selected, bins]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="p-4 pb-2">
        <h1 className="heading text-2xl">Puntos de Reciclaje</h1>
      </div>

      <div ref={mapRef} className="w-full aspect-[4/3]" style={{ minHeight: 300 }} />

      <div className="p-4 flex flex-col gap-2 max-h-[40vh] overflow-y-auto hide-scrollbar">
        {bins.map((bin, i) => (
          <motion.button
            key={bin.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            onClick={() => setSelected(bin.id)}
            className={`flex items-center gap-3 p-3.5 border-2 text-left w-full cursor-pointer transition-all
              ${selected === bin.id ? "border-red bg-red/5" : "border-line bg-white hover:border-ink"}`}
          >
            <MapPin size={20} className={bin.estado === "Activo" ? "text-red shrink-0" : "text-mid shrink-0"} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-semibold text-ink truncate">{bin.ubicacion}</p>
              <div className="flex items-center gap-3 mt-1">
                {bin.horario && (
                  <span className="flex items-center gap-1 font-body text-[10px] text-mid uppercase tracking-wider">
                    <Clock size={10} aria-hidden="true" />
                    {bin.horario}
                  </span>
                )}
                <span className="font-body text-[10px] text-mid uppercase">{bin.codigo}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {bin.estado === "Activo" ? (
                <BatteryFull size={14} color="#FF3333" aria-hidden="true" />
              ) : (
                <BatteryMedium size={14} color="#666" aria-hidden="true" />
              )}
              <span className="font-body text-[10px] uppercase text-mid">{bin.estado}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
