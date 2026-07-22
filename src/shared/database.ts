import { DataSource } from "typeorm";
import { Usuario } from "../backend/entities/Usuario";
import { Basurero } from "../backend/entities/Basurero";
import { Deposito } from "../backend/entities/Deposito";
import { SesionQR } from "../backend/entities/SesionQR";
import { Cupon } from "../backend/entities/Cupon";
import { Canje } from "../backend/entities/Canje";
import { Logro } from "../backend/entities/Logro";
import { LogroUsuario } from "../backend/entities/LogroUsuario";
import path from "path";

export const AppDataSource = new DataSource({
  type: "sqljs",
  location: path.resolve(process.env.DB_PATH || "./data/barriopizza.db"),
  autoSave: true,
  entities: [Usuario, Basurero, Deposito, SesionQR, Cupon, Canje, Logro, LogroUsuario],
  synchronize: true,
  logging: false,
});
