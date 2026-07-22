import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("sesiones_qr")
export class SesionQR {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  token!: string;

  @Column()
  depositoId!: string;

  @Column({ type: "datetime" })
  expiraEn!: Date;

  @Column({ default: false })
  usado!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
