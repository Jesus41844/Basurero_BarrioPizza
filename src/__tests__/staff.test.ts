import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp, cleanDB, testAuthHeader } from "./helpers";
import { staffRoutes } from "../backend/routes/staff";
import { authMiddleware } from "../shared/auth";
import { AppDataSource } from "../shared/database";
import { Canje } from "../backend/entities/Canje";

describe("POST /api/v1/staff/validate-coupon", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    await cleanDB();
    app = createTestApp();
    app.use("/api/v1/staff", authMiddleware, staffRoutes);
  });

  it("rechaza sin auth", async () => {
    const res = await request(app)
      .post("/api/v1/staff/validate-coupon")
      .send({});
    expect(res.status).toBe(401);
  });

  it("rechaza cupón inexistente", async () => {
    const res = await request(app)
      .post("/api/v1/staff/validate-coupon")
      .set(testAuthHeader("staff"))
      .send({ codigo: "NO-EXISTE" });
    expect(res.status).toBe(404);
  });

  it("marca cupón como consumido", async () => {
    const repo = AppDataSource.getRepository(Canje);
    const canje = repo.create({
      codigoUnico: "BP-TEST123",
      usuarioId: "u1",
      cuponId: "c1",
      estado: "activo",
    });
    await repo.save(canje);

    const res = await request(app)
      .post("/api/v1/staff/validate-coupon")
      .set(testAuthHeader("staff"))
      .send({ codigo: "BP-TEST123" });
    expect(res.status).toBe(200);
    expect(res.body.valido).toBe(true);

    const updated = await repo.findOne({ where: { codigoUnico: "BP-TEST123" } });
    expect(updated?.estado).toBe("consumido");
  });
});
