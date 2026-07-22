import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Canje } from "./Canje";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  nombre!: string;

  @Column({ default: 0 })
  puntos!: number;

  @Column({ default: "cliente" })
  rol!: string;

  @OneToMany(() => Canje, (canje) => canje.usuario)
  canjes!: Canje[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
