import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Basurero } from "./Basurero";

@Entity("depositos")
export class Deposito {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  basureroId!: string;

  @Column({ type: "float" })
  pesoGramos!: number;

  @Column({ type: "int" })
  puntos!: number;

  @Column({ default: "no_reclamado" })
  estado!: string;

  @Column({ nullable: true })
  usuarioId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
