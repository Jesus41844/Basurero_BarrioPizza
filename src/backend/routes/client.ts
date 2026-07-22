import { Router, Request, Response } from "express";
import { AppDataSource } from "../../shared/database";
import { SesionQR } from "../entities/SesionQR";
import { Deposito } from "../entities/Deposito";
import { Usuario } from "../entities/Usuario";
import { Canje } from "../entities/Canje";
import { Cupon } from "../entities/Cupon";
import { Logro } from "../entities/Logro";
import { LogroUsuario } from "../entities/LogroUsuario";

export const clientRoutes = Router();
const userRepo = () => AppDataSource.getRepository(Usuario);

clientRoutes.get("/wallet", async (req: Request, res: Response) => {
  const usuarioId = (req as any).usuario.id;
  const usuario = await userRepo().findOne({ where: { id: usuarioId } });
  if (!usuario) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  const cuponRepo = AppDataSource.getRepository(Cupon);
  const cupones = await cuponRepo.find({ where: { activo: true } });

  res.json({
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, puntos: usuario.puntos, rol: usuario.rol },
    cupones,
  });
});

clientRoutes.get("/history", async (req: Request, res: Response) => {
  const usuarioId = (req as any).usuario.id;
  const depRepo = AppDataSource.getRepository(Deposito);
  const canjeRepo = AppDataSource.getRepository(Canje);

  const depositos = await depRepo.find({
    where: { usuarioId },
    order: { createdAt: "DESC" },
    take: 50,
  });

  const canjes = await canjeRepo.find({
    where: { usuarioId },
    order: { createdAt: "DESC" },
    take: 50,
  });

  const items = [
    ...depositos.map((d) => ({
      id: d.id,
      tipo: "deposito" as const,
      descripcion: d.basureroId,
      detalle: `${d.pesoGramos} g`,
      puntos: d.puntos,
      fecha: d.createdAt.toISOString(),
    })),
    ...canjes.map((c) => ({
      id: c.id,
      tipo: "canje" as const,
      descripcion: c.codigoUnico,
      detalle: `Cupón ${c.codigoUnico}`,
      puntos: 0,
      fecha: c.createdAt.toISOString(),
    })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  res.json(items);
});

clientRoutes.get("/achievements", async (req: Request, res: Response) => {
  const usuarioId = (req as any).usuario.id;
  const logroRepo = AppDataSource.getRepository(Logro);
  const luRepo = AppDataSource.getRepository(LogroUsuario);

  const logros = await logroRepo.find({ where: { activo: true } });
  const result = await Promise.all(
    logros.map(async (l) => {
      const lu = await luRepo.findOne({ where: { usuarioId, logroId: l.id } });
      return {
        id: l.id,
        nombre: l.nombre,
        descripcion: l.descripcion,
        criterio: l.criterio,
        metaValor: l.metaValor,
        icono: l.icono,
        progreso: lu?.progreso || 0,
        completado: lu?.completado || false,
      };
    })
  );
  res.json(result);
});

clientRoutes.post("/reclaim", async (req: Request, res: Response) => {
  const { token } = req.body;
  const usuarioId = (req as any).usuario.id;

  if (!token) {
    res.status(400).json({ error: "Falta token" });
    return;
  }

  const qrRepo = AppDataSource.getRepository(SesionQR);
  const sesion = await qrRepo.findOne({ where: { token } });

  if (!sesion) {
    res.status(404).json({ error: "Token no encontrado" });
    return;
  }

  if (sesion.usado) {
    res.status(409).json({ error: "Este QR ya fue reclamado" });
    return;
  }

  if (new Date() > new Date(sesion.expiraEn)) {
    res.status(410).json({ error: "El QR ha expirado" });
    return;
  }

  const depRepo = AppDataSource.getRepository(Deposito);
  const deposito = await depRepo.findOne({ where: { id: sesion.depositoId } });
  if (!deposito) {
    res.status(404).json({ error: "Depósito no encontrado" });
    return;
  }

  const usuario = await userRepo().findOne({ where: { id: usuarioId } });
  if (!usuario) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }
  usuario.puntos += deposito.puntos;
  await userRepo().save(usuario);

  deposito.estado = "reclamado";
  deposito.usuarioId = usuarioId;
  await depRepo.save(deposito);

  sesion.usado = true;
  await qrRepo.save(sesion);

  res.json({ message: "Puntos acreditados", puntos: deposito.puntos, total: usuario.puntos });
});

clientRoutes.post("/redeem", async (req: Request, res: Response) => {
  const { cuponId } = req.body;
  const usuarioId = (req as any).usuario.id;

  if (!cuponId) {
    res.status(400).json({ error: "Falta cuponId" });
    return;
  }

  const usuario = await userRepo().findOne({ where: { id: usuarioId } });
  if (!usuario) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  const cuponRepo = AppDataSource.getRepository(Cupon);
  const cupon = await cuponRepo.findOne({ where: { id: cuponId, activo: true } });
  if (!cupon) {
    res.status(404).json({ error: "Cupón no disponible" });
    return;
  }

  if (usuario.puntos < cupon.costoPuntos) {
    res.status(402).json({ error: "Puntos insuficientes" });
    return;
  }

  usuario.puntos -= cupon.costoPuntos;
  await userRepo().save(usuario);

  const codigoUnico = `BP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const canjeRepo = AppDataSource.getRepository(Canje);
  const canje = canjeRepo.create({ usuarioId, cuponId, codigoUnico });
  await canjeRepo.save(canje);

  res.json({ message: "Cupón generado", codigo: codigoUnico, puntosRestantes: usuario.puntos });
});
