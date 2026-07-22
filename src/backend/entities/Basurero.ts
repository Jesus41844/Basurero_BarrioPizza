import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("basureros")
export class Basurero {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  codigo!: string;

  @Column({ default: "Activo" })
  estado!: string;

  @Column({ type: "float", default: 0.1 })
  factorMultiplicador!: number;

  @Column({ nullable: true })
  ubicacion!: string;

  @Column({ type: "float", nullable: true })
  lat!: number;

  @Column({ type: "float", nullable: true })
  lng!: number;

  @Column({ nullable: true })
  horario!: string;

  @Column({ nullable: true })
  telefono!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
