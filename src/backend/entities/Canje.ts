import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Entity("canjes")
export class Canje {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  usuarioId!: string;

  @Column()
  cuponId!: string;

  @Column({ unique: true })
  codigoUnico!: string;

  @Column({ default: "activo" })
  estado!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.canjes)
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;

  @CreateDateColumn()
  createdAt!: Date;
}
