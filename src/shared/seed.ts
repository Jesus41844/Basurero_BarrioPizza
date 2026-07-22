import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "./database";
import { Basurero } from "../backend/entities/Basurero";
import { Usuario } from "../backend/entities/Usuario";
import { Cupon } from "../backend/entities/Cupon";
import { Logro } from "../backend/entities/Logro";

dotenv.config();

async function seed() {
  await AppDataSource.initialize();
  console.log("DB conectada");

  const binRepo = AppDataSource.getRepository(Basurero);
  const existing = await binRepo.count();
  if (existing > 0) {
    console.log("La BD ya tiene datos, saltando seed");
    await AppDataSource.destroy();
    return;
  }

  await binRepo.save([
    { codigo: "BIN-001", factorMultiplicador: 0.10, ubicacion: "Royal Blue Plaza, PB, Vía Porras, San Francisco", lat: 8.993756, lng: -79.515870, horario: "11:00–22:00", telefono: "+507 264-8222" },
    { codigo: "BIN-002", factorMultiplicador: 0.10, ubicacion: "Rada Plaza Local 10, Av. Centenario, Costa del Este", lat: 9.015339, lng: -79.477603, horario: "11:00–22:00", telefono: "+507 391-8222" },
    { codigo: "BIN-003", factorMultiplicador: 0.10, ubicacion: "Dorado City Center, Vía Ricardo J. Alfaro, El Dorado", lat: 9.015096, lng: -79.534847, horario: "11:00–22:00", telefono: "+507 294-8222" },
    { codigo: "BIN-004", factorMultiplicador: 0.10, ubicacion: "Plaza Northside Galleries, Brisas del Golf", lat: 9.049170, lng: -79.459000, horario: "11:00–22:00", telefono: "+507 271-8222" },
    { codigo: "BIN-005", factorMultiplicador: 0.10, ubicacion: "Punto Marbella, Vía España, Marbella", lat: 8.995000, lng: -79.512000, horario: "11:00–22:00", telefono: "+507 265-8222" },
    { codigo: "BIN-006", factorMultiplicador: 0.10, ubicacion: "Vía Argentina, El Cangrejo", lat: 8.980200, lng: -79.522700, horario: "11:00–22:00", telefono: "+507 264-8333" },
    { codigo: "BIN-007", factorMultiplicador: 0.10, ubicacion: "Clayton, Ciudad del Saber", lat: 8.983400, lng: -79.558400, horario: "11:00–21:00", telefono: "+507 317-8222" },
    { codigo: "BIN-008", factorMultiplicador: 0.10, ubicacion: "Market Plaza, La Chorrera (Costa Verde)", lat: 8.879800, lng: -79.781700, horario: "11:00–21:00", telefono: "+507 254-8222" },
    { codigo: "BIN-009", factorMultiplicador: 0.10, ubicacion: "Plaza El Sol, Margarita, Colón", lat: 9.354700, lng: -79.900000, horario: "11:00–21:00", telefono: "+507 441-8222" },
    { codigo: "BIN-010", factorMultiplicador: 0.10, ubicacion: "Aeropuerto Internacional de Tocumen (Zona Food Court)", lat: 9.071200, lng: -79.383500, horario: "06:00–22:00", telefono: "+507 238-8222" },
  ]);
  console.log("Basureros creados (Panamá)");

  const userRepo = AppDataSource.getRepository(Usuario);
  await userRepo.save([
    { id: "test-user-1", nombre: "Cliente Demo", email: "cliente@test.com", puntos: 186, rol: "cliente" },
    { id: "staff-user-1", nombre: "Staff Demo", email: "staff@test.com", puntos: 0, rol: "staff" },
  ]);
  console.log("Usuarios creados");

  const cuponRepo = AppDataSource.getRepository(Cupon);
  await cuponRepo.save([
    { codigo: "PIZZA-PERSONAL", descripcion: "Pizza Personal 1 Ingrediente", costoPuntos: 50, activo: true },
    { codigo: "PIZZA-MEDIANA", descripcion: "Pizza Mediana 2 Ingredientes", costoPuntos: 100, activo: true },
    { codigo: "PIZZA-FAMILIAR", descripcion: "Pizza Familiar 3 Ingredientes + Bebida 2L", costoPuntos: 200, activo: true },
    { codigo: "COMBO-FAMILIAR", descripcion: "Combo Familiar 2 Pizzas + 2 Bebidas", costoPuntos: 350, activo: true },
  ]);
  console.log("Cupones creados");

  const logroRepo = AppDataSource.getRepository(Logro);
  await logroRepo.save([
    { codigo: "PRIMER-DEPOSITO", nombre: "Primer depósito", descripcion: "Realizá tu primer reciclaje", criterio: "depositos", metaValor: 1, icono: "Trash2" },
    { codigo: "10-DEPOSITOS", nombre: "10 depósitos", descripcion: "Acumulá 10 reciclajes", criterio: "depositos", metaValor: 10, icono: "TrendingUp" },
    { codigo: "50-KG", nombre: "50 kg reciclados", descripcion: "Alcanzá los 50 kg de reciclaje", criterio: "peso", metaValor: 50, icono: "Award" },
    { codigo: "3-CANJES", nombre: "3 canjes", descripcion: "Canjeá 3 cupones", criterio: "canjes", metaValor: 3, icono: "Gift" },
    { codigo: "TODOS-BASUREROS", nombre: "Reciclador estrella", descripcion: "Reciclá en todos los basureros", criterio: "basureros", metaValor: 10, icono: "Star" },
  ]);
  console.log("Logros creados");

  await AppDataSource.destroy();
  console.log("Seed completado");
}

seed().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});
