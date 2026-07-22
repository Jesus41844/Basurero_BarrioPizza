import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Logro } from "./Logro";

@Entity("logros_usuario")
export class LogroUsuario {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  usuarioId!: string;

  @Column()
  logroId!: string;

  @Column({ type: "float", default: 0 })
  progreso!: number;

  @Column({ default: false })
  completado!: boolean;

  @Column({ nullable: true })
  completadoEn!: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;

  @ManyToOne(() => Logro)
  @JoinColumn({ name: "logroId" })
  logro!: Logro;

  @CreateDateColumn()
  createdAt!: Date;
}
