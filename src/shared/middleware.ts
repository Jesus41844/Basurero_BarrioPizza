import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./database";
import { Basurero } from "../backend/entities/Basurero";

export async function hardwareAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["x-bin-token"] as string;
  if (!token) {
    res.status(401).json({ error: "Falta X-Bin-Token" });
    return;
  }

  const repo = AppDataSource.getRepository(Basurero);
  const basurero = await repo.findOne({ where: { codigo: token } });

  if (!basurero) {
    res.status(403).json({ error: "Token de basurero inválido" });
    return;
  }

  (req as any).basurero = basurero;
  next();
}
