import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp, seedBasurero, cleanDB, testAuthHeader } from "./helpers";
import { adminRoutes } from "../backend/routes/admin";
import { authMiddleware } from "../shared/auth";

describe("CRUD /api/v1/admin/bins", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    await cleanDB();
    app = createTestApp();
    app.use("/api/v1/admin", authMiddleware, adminRoutes);
  });

  it("rechaza sin auth", async () => {
    const res = await request(app).get("/api/v1/admin/bins");
    expect(res.status).toBe(401);
  });

  it("lista basureros vacío", async () => {
    const res = await request(app)
      .get("/api/v1/admin/bins")
      .set(testAuthHeader("admin"));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("crea un basurero", async () => {
    const res = await request(app)
      .post("/api/v1/admin/bins")
      .set(testAuthHeader("admin"))
      .send({ codigo: "BIN-NEW", factorMultiplicador: 0.15, ubicacion: "Test" });
    expect(res.status).toBe(201);
    expect(res.body.codigo).toBe("BIN-NEW");
  });

  it("obtiene un basurero por id", async () => {
    const created = await seedBasurero("BIN-GET");
    const res = await request(app)
      .get(`/api/v1/admin/bins/${created.id}`)
      .set(testAuthHeader("admin"));
    expect(res.status).toBe(200);
    expect(res.body.codigo).toBe("BIN-GET");
  });

  it("actualiza un basurero", async () => {
    const created = await seedBasurero("BIN-UPD");
    const res = await request(app)
      .put(`/api/v1/admin/bins/${created.id}`)
      .set(testAuthHeader("admin"))
      .send({ factorMultiplicador: 0.99 });
    expect(res.status).toBe(200);
    expect(res.body.factorMultiplicador).toBe(0.99);
  });

  it("elimina un basurero", async () => {
    const created = await seedBasurero("BIN-DEL");
    const res = await request(app)
      .delete(`/api/v1/admin/bins/${created.id}`)
      .set(testAuthHeader("admin"));
    expect(res.status).toBe(200);
  });
});
