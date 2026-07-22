import { Router, Request, Response } from "express";
import { AppDataSource } from "../../shared/database";
import { Canje } from "../entities/Canje";
import { Cupon } from "../entities/Cupon";
import { Logro } from "../entities/Logro";
import { LogroUsuario } from "../entities/LogroUsuario";
import { Basurero } from "../entities/Basurero";
import { Deposito } from "../entities/Deposito";

export const staffRoutes = Router();

function isStaff(req: Request): boolean {
  return (req as any).usuario?.rol === "staff";
}

function requireStaff(req: Request, res: Response): boolean {
  if (!isStaff(req)) {
    res.status(403).json({ error: "Se requiere rol staff" });
    return false;
  }
  return true;
}

// ─── Coupon management ──────────────────────────────────────────────

staffRoutes.get("/coupons", async (_req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Cupon);
  const cupones = await repo.find({ order: { createdAt: "DESC" } });
  res.json(cupones);
});

staffRoutes.post("/coupons", async (req: Request, res: Response) => {
  if (!requireStaff(req, res)) return;
  const { codigo, descripcion, costoPuntos, activo } = req.body;
  if (!codigo || !descripcion || costoPuntos == null) {
    res.status(400).json({ error: "Faltan datos: codigo, descripcion, costoPuntos" });
    return;
  }
  const repo = AppDataSource.getRepository(Cupon);
  const cupon = repo.create({ codigo, descripcion, costoPuntos, activo: activo !== false });
  await repo.save(cupon);
  res.status(201).json(cupon);
});

staffRoutes.put("/coupons/:id", async (req: Request, res: Response) => {
  if (!requireStaff(req, res)) return;
  const repo = AppDataSource.getRepository(Cupon);
  const cupon = await repo.findOne({ where: { id: req.params.id } });
  if (!cupon) {
    res.status(404).json({ error: "Cupón no encontrado" });
    return;
  }
  Object.assign(cupon, req.body);
  await repo.save(cupon);
  res.json(cupon);
});

staffRoutes.delete("/coupons/:id", async (req: Request, res: Response) => {
  if (!requireStaff(req, res)) return;
  const repo = AppDataSource.getRepository(Cupon);
  const result = await repo.delete(req.params.id);
  if (result.affected === 0) {
    res.status(404).json({ error: "Cupón no encontrado" });
    return;
  }
  res.json({ message: "Cupón eliminado" });
});

// ─── Achievement management ──────────────────────────────────────────

staffRoutes.get("/achievements", async (_req: Request, res: Response) => {
  const logroRepo = AppDataSource.getRepository(Logro);
  const luRepo = AppDataSource.getRepository(LogroUsuario);

  const logros = await logroRepo.find({ order: { createdAt: "DESC" } });
  const result = await Promise.all(
    logros.map(async (l) => {
      const count = await luRepo.count({ where: { logroId: l.id, completado: true } });
      return { ...l, usuariosCompletados: count };
    })
  );
  res.json(result);
});

staffRoutes.post("/achievements", async (req: Request, res: Response) => {
  if (!requireStaff(req, res)) return;
  const { codigo, nombre, descripcion, criterio, metaValor, icono } = req.body;
  if (!codigo || !nombre || !criterio || metaValor == null) {
    res.status(400).json({ error: "Faltan datos: codigo, nombre, criterio, metaValor" });
    return;
  }
  const repo = AppDataSource.getRepository(Logro);
  const logro = repo.create({ codigo, nombre, descripcion, criterio, metaValor: Number(metaValor), icono: icono || "Award" });
  await repo.save(logro);
  res.status(201).json(logro);
});

staffRoutes.put("/achievements/:id", async (req: Request, res: Response) => {
  if (!requireStaff(req, res)) return;
  const repo = AppDataSource.getRepository(Logro);
  const logro = await repo.findOne({ where: { id: req.params.id } });
  if (!logro) {
    res.status(404).json({ error: "Logro no encontrado" });
    return;
  }
  Object.assign(logro, req.body);
  await repo.save(logro);
  res.json(logro);
});

staffRoutes.delete("/achievements/:id", async (req: Request, res: Response) => {
  if (!requireStaff(req, res)) return;
  const repo = AppDataSource.getRepository(Logro);
  const result = await repo.delete(req.params.id);
  if (result.affected === 0) {
    res.status(404).json({ error: "Logro no encontrado" });
    return;
  }
  await AppDataSource.getRepository(LogroUsuario).delete({ logroId: req.params.id });
  res.json({ message: "Logro eliminado" });
});

// ─── Reports ─────────────────────────────────────────────────────────

staffRoutes.get("/reports", async (_req: Request, res: Response) => {
  const depRepo = AppDataSource.getRepository(Deposito);
  const canjeRepo = AppDataSource.getRepository(Canje);

  const totalDepositos = await depRepo.count();
  const pesoResult = await depRepo
    .createQueryBuilder("d")
    .select("SUM(d.pesoGramos)", "total")
    .getRawOne();
  const puntosResult = await depRepo
    .createQueryBuilder("d")
    .select("SUM(d.puntos)", "total")
    .getRawOne();
  const totalCanjes = await canjeRepo.count();

  // Cupones más usados
  const topCoupons = await canjeRepo
    .createQueryBuilder("c")
    .select("c.cuponId", "cuponId")
    .addSelect("COUNT(c.id)", "usos")
    .groupBy("c.cuponId")
    .orderBy("usos", "DESC")
    .limit(5)
    .getRawMany();

  // Usos por basurero
  const binUsage = await depRepo
    .createQueryBuilder("d")
    .select("d.basureroId", "basureroId")
    .addSelect("COUNT(d.id)", "usos")
    .groupBy("d.basureroId")
    .orderBy("usos", "DESC")
    .getRawMany();

  res.json({
    totalDepositos,
    pesoTotal: Number(pesoResult?.total || 0),
    puntosEntregados: Number(puntosResult?.total || 0),
    totalCanjes,
    topCoupons,
    binUsage,
  });
});

// ─── Validate coupon ─────────────────────────────────────────────────

staffRoutes.post("/validate-coupon", async (req: Request, res: Response) => {
  const { codigo } = req.body;

  if (!codigo) {
    res.status(400).json({ error: "Falta el código del cupón" });
    return;
  }

  const canjeRepo = AppDataSource.getRepository(Canje);
  const canje = await canjeRepo.findOne({ where: { codigoUnico: codigo } });

  if (!canje) {
    res.status(404).json({ error: "Cupón no encontrado" });
    return;
  }

  if (canje.estado === "consumido") {
    res.status(409).json({ error: "Este cupón ya fue usado" });
    return;
  }

  canje.estado = "consumido";
  await canjeRepo.save(canje);

  res.json({ message: "Cupón validado y consumido", valido: true });
});
