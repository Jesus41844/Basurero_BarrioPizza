import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp, seedBasurero, cleanDB } from "./helpers";
import { hardwareRoutes } from "../backend/routes/hardware";

describe("POST /api/v1/hardware/bin-event", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    await cleanDB();
    app = createTestApp();
    app.use("/api/v1/hardware", hardwareRoutes);
  });

  it("rechaza sin X-Bin-Token", async () => {
    const res = await request(app)
      .post("/api/v1/hardware/bin-event")
      .send({ basureroId: "x", pesoGramos: 500 });
    expect(res.status).toBe(401);
    expect(res.body.error).toContain("X-Bin-Token");
  });

  it("rechaza token inválido", async () => {
    const res = await request(app)
      .post("/api/v1/hardware/bin-event")
      .set("X-Bin-Token", "fake-token")
      .send({ basureroId: "x", pesoGramos: 500 });
    expect(res.status).toBe(403);
  });

  it("rechaza payload inválido", async () => {
    await seedBasurero("BIN-VALID");
    const res = await request(app)
      .post("/api/v1/hardware/bin-event")
      .set("X-Bin-Token", "BIN-VALID")
      .send({ basureroId: "x", pesoGramos: -1 });
    expect(res.status).toBe(400);
  });

  it("acepta evento válido y responde 202", async () => {
    await seedBasurero("BIN-VALID");
    const res = await request(app)
      .post("/api/v1/hardware/bin-event")
      .set("X-Bin-Token", "BIN-VALID")
      .send({ basureroId: "x", pesoGramos: 500 });
    expect(res.status).toBe(202);
    expect(res.body.message).toContain("aceptado");
  });
});
