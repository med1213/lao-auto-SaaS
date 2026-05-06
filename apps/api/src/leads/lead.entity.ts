import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Car } from '../cars/car.entity';
import { LeadStatus } from '../common/enums';
import { Tenant } from '../tenants/tenant.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  tenantId!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @Column({ nullable: true })
  carId?: string;

  @ManyToOne(() => Car, (car) => car.leads, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'carId' })
  car?: Car;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  source?: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.New })
  status!: LeadStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

