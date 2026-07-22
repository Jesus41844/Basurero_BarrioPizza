import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("logros")
export class Logro {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  codigo!: string;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion!: string;

  @Column()
  criterio!: string;

  @Column({ type: "int", default: 1 })
  metaValor!: number;

  @Column({ default: "Award" })
  icono!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
