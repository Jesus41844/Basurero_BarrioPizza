import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("cupones")
export class Cupon {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  codigo!: string;

  @Column()
  descripcion!: string;

  @Column({ type: "int" })
  costoPuntos!: number;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
