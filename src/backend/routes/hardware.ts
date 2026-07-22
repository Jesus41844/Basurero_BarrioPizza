import { Router, Request, Response } from "express";
import { z } from "zod";
import { hardwareAuth } from "../../shared/middleware";
import { reciclajeQueue } from "../../shared/queue";

export const hardwareRoutes = Router();

const binEventSchema = z.object({
  basureroId: z.string().min(1),
  pesoGramos: z.number().positive(),
  timestamp: z.string().datetime().optional(),
});

hardwareRoutes.post("/bin-event", hardwareAuth, async (req: Request, res: Response) => {
  const parsed = binEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Payload inválido", details: parsed.error.flatten() });
    return;
  }

  const basurero = (req as any).basurero;

  await reciclajeQueue.add("procesar-deposito", {
    basureroId: basurero.id,
    pesoGramos: parsed.data.pesoGramos,
    factorMultiplicador: basurero.factorMultiplicador,
    timestamp: parsed.data.timestamp || new Date().toISOString(),
  });

  res.status(202).json({ message: "Evento aceptado, procesando..." });
});
