import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp, seedUsuario, cleanDB, testAuthHeader } from "./helpers";
import { clientRoutes } from "../backend/routes/client";
import { authMiddleware } from "../shared/auth";
import { AppDataSource } from "../shared/database";
import { Deposito } from "../backend/entities/Deposito";
import { SesionQR } from "../backend/entities/SesionQR";
import { Cupon } from "../backend/entities/Cupon";

describe("POST /api/v1/client/reclaim", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    await cleanDB();
    app = createTestApp();
    app.use("/api/v1/client", authMiddleware, clientRoutes);
  });

  it("rechaza sin auth", async () => {
    const res = await request(app)
      .post("/api/v1/client/reclaim")
      .send({ token: "x" });
    expect(res.status).toBe(401);
  });

  it("rechaza token QR inexistente", async () => {
    const res = await request(app)
      .post("/api/v1/client/reclaim")
      .set(testAuthHeader("u1"))
      .send({ token: "fake" });
    expect(res.status).toBe(404);
  });

  it("acredita puntos con token válido", async () => {
    const depRepo = AppDataSource.getRepository(Deposito);
    const deposito = depRepo.create({
      basureroId: "b1",
      pesoGramos: 500,
      puntos: 50,
      estado: "no_reclamado",
    });
    await depRepo.save(deposito);

    const qrRepo = AppDataSource.getRepository(SesionQR);
    const sesion = qrRepo.create({
      token: "test-token-1",
      depositoId: deposito.id,
      expiraEn: new Date(Date.now() + 60_000),
    });
    await qrRepo.save(sesion);

    await seedUsuario("u1", 0);

    const res = await request(app)
      .post("/api/v1/client/reclaim")
      .set(testAuthHeader("u1"))
      .send({ token: "test-token-1" });
    expect(res.status).toBe(200);
    expect(res.body.puntos).toBe(50);
  });
});

describe("POST /api/v1/client/redeem", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    await cleanDB();
    app = createTestApp();
    app.use("/api/v1/client", authMiddleware, clientRoutes);
  });

  it("rechaza sin auth", async () => {
    const res = await request(app)
      .post("/api/v1/client/redeem")
      .send({});
    expect(res.status).toBe(401);
  });

  it("genera cupón si tiene puntos suficientes", async () => {
    await seedUsuario("u1", 200);

    const cuponRepo = AppDataSource.getRepository(Cupon);
    const cupon = cuponRepo.create({
      id: "cupon-test",
      codigo: "TEST",
      descripcion: "Test",
      costoPuntos: 50,
      activo: true,
    });
    await cuponRepo.save(cupon);

    const res = await request(app)
      .post("/api/v1/client/redeem")
      .set(testAuthHeader("u1"))
      .send({ cuponId: "cupon-test" });
    expect(res.status).toBe(200);
    expect(res.body.codigo).toMatch(/^BP-/);
  });
});
