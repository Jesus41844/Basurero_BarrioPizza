import "reflect-metadata";
import { AppDataSource } from "../shared/database";
import { createWorker } from "../shared/queue";
import { Deposito } from "../backend/entities/Deposito";
import { SesionQR } from "../backend/entities/SesionQR";
import { publishEvent } from "../shared/events";
import crypto from "crypto";

AppDataSource.initialize()
  .then(() => {
    const worker = createWorker(async (job) => {
      const { basureroId, pesoGramos, factorMultiplicador } = job.data;

      const puntos = Math.round(pesoGramos * factorMultiplicador);

      const depRepo = AppDataSource.getRepository(Deposito);
      const deposito = depRepo.create({
        basureroId,
        pesoGramos,
        puntos,
        estado: "no_reclamado",
      });
      await depRepo.save(deposito);

      const qrRepo = AppDataSource.getRepository(SesionQR);
      const token = crypto.randomBytes(4).toString("hex");
      const sesion = qrRepo.create({
        token,
        depositoId: deposito.id,
        expiraEn: new Date(Date.now() + 3 * 60 * 1000),
      });
      await qrRepo.save(sesion);

      publishEvent("qr-generado", {
        basureroId,
        token,
        url: `https://barriopizza.app/reclamar?token=${token}`,
      });

      console.log(`Depósito procesado: ${pesoGramos}g -> ${puntos} pts, token=${token}`);
    });

    console.log("Worker de reciclaje iniciado");
  })
  .catch((err) => {
    console.error("Error al iniciar worker:", err);
  });
