import { Router, Request, Response } from "express";
import { AppDataSource } from "../../shared/database";
import { Basurero } from "../entities/Basurero";

export const binsRoutes = Router();

binsRoutes.get("/locations", async (_req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Basurero);
  const bins = await repo.find({
    select: ["id", "codigo", "ubicacion", "estado", "factorMultiplicador", "lat", "lng", "horario", "telefono"],
  });
  res.json(bins);
});
