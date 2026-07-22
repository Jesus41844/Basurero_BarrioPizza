import { Router, Request, Response } from "express";
import { AppDataSource } from "../../shared/database";
import { Basurero } from "../entities/Basurero";
import { Deposito } from "../entities/Deposito";
import { Canje } from "../entities/Canje";

export const adminRoutes = Router();
const basureroRepo = () => AppDataSource.getRepository(Basurero);

adminRoutes.get("/bins", async (_req: Request, res: Response) => {
  const bins = await basureroRepo().find();
  res.json(bins);
});

adminRoutes.get("/bins/:id", async (req: Request, res: Response) => {
  const bin = await basureroRepo().findOne({ where: { id: req.params.id } });
  if (!bin) {
    res.status(404).json({ error: "Basurero no encontrado" });
    return;
  }
  res.json(bin);
});

adminRoutes.post("/bins", async (req: Request, res: Response) => {
  const { codigo, factorMultiplicador, ubicacion } = req.body;
  if (!codigo) {
    res.status(400).json({ error: "Falta el código del basurero" });
    return;
  }
  const bin = basureroRepo().create({ codigo, factorMultiplicador, ubicacion });
  await basureroRepo().save(bin);
  res.status(201).json(bin);
});

adminRoutes.put("/bins/:id", async (req: Request, res: Response) => {
  const bin = await basureroRepo().findOne({ where: { id: req.params.id } });
  if (!bin) {
    res.status(404).json({ error: "Basurero no encontrado" });
    return;
  }
  Object.assign(bin, req.body);
  await basureroRepo().save(bin);
  res.json(bin);
});

adminRoutes.delete("/bins/:id", async (req: Request, res: Response) => {
  const result = await basureroRepo().delete(req.params.id);
  if (result.affected === 0) {
    res.status(404).json({ error: "Basurero no encontrado" });
    return;
  }
  res.json({ message: "Basurero eliminado" });
});

adminRoutes.get("/reports", async (_req: Request, res: Response) => {
  const depRepo = AppDataSource.getRepository(Deposito);
  const canjeRepo = AppDataSource.getRepository(Canje);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const depositos = await depRepo
    .createQueryBuilder("d")
    .select("COUNT(d.id)", "total")
    .addSelect("SUM(d.pesoGramos)", "pesoTotal")
    .addSelect("SUM(d.puntos)", "puntosEntregados")
    .where("d.createdAt BETWEEN :start AND :end", { start: todayStart, end: todayEnd })
    .getRawOne();

  const canjes = await canjeRepo.count({
    where: { createdAt: new Date() },
  });

  res.json({
    fecha: todayStart.toISOString(),
    depositos: Number(depositos?.total) || 0,
    pesoTotal: Number(depositos?.pesoTotal) || 0,
    puntosEntregados: Number(depositos?.puntosEntregados) || 0,
    cuponesCanjeados: canjes,
  });
});
