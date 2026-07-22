import express from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../shared/database";
import { Basurero } from "../backend/entities/Basurero";
import { Usuario } from "../backend/entities/Usuario";
import { Cupon } from "../backend/entities/Cupon";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export function testAuthHeader(userId = "test-u1") {
  const token = jwt.sign({ id: userId, email: `${userId}@test.com` }, JWT_SECRET, { expiresIn: "1h" });
  return { Authorization: `Bearer ${token}` };
}

export function createTestApp() {
  const app = express();
  app.use(express.json());
  return app;
}

export async function seedBasurero(codigo = "BIN-TEST-001") {
  const repo = AppDataSource.getRepository(Basurero);
  const existing = await repo.findOne({ where: { codigo } });
  if (existing) return existing;
  const bin = repo.create({ codigo, factorMultiplicador: 0.1, ubicacion: "Test" });
  return repo.save(bin);
}

export async function seedUsuario(id = "test-user-1", puntos = 100) {
  const repo = AppDataSource.getRepository(Usuario);
  const existing = await repo.findOne({ where: { id } });
  if (existing) return existing;
  const user = repo.create({ id, nombre: "Test", email: `${id}@test.com`, puntos });
  return repo.save(user);
}

export async function seedCupon() {
  const repo = AppDataSource.getRepository(Cupon);
  const cupon = repo.create({ codigo: "PIZZA-MED", descripcion: "Pizza mediana", costoPuntos: 50 });
  return repo.save(cupon);
}

export async function cleanDB() {
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repo = AppDataSource.getRepository(entity.name);
    await repo.clear();
  }
}
