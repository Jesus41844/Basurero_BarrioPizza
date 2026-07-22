import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "./database";
import { Usuario } from "../backend/entities/Usuario";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export const authRoutes = Router();

authRoutes.post("/register", async (req: Request, res: Response) => {
  const { email, nombre } = req.body;
  if (!email || !nombre) {
    res.status(400).json({ error: "Faltan email y/o nombre" });
    return;
  }

  const repo = AppDataSource.getRepository(Usuario);
  const existing = await repo.findOne({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "El email ya está registrado" });
    return;
  }

  const usuario = repo.create({ email, nombre });
  await repo.save(usuario);

  const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(201).json({ token, usuario: { id: usuario.id, nombre, email, puntos: 0, rol: usuario.rol } });
});

authRoutes.post("/login", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Falta email" });
    return;
  }

  const repo = AppDataSource.getRepository(Usuario);
  const usuario = await repo.findOne({ where: { email } });
  if (!usuario) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email, puntos: usuario.puntos, rol: usuario.rol } });
});

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as { id: string; email: string; rol: string };
    (req as any).usuario = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
