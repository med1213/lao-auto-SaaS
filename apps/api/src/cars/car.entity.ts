import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from '../bookings/booking.entity';
import { Lead } from '../leads/lead.entity';
import { CarStatus } from '../common/enums';
import { Tenant } from '../tenants/tenant.entity';
import { CarImage } from './car-image.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  tenantId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.cars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @Column()
  make!: string;

  @Column()
  model!: string;

  @Column()
  trim!: string;

  @Column()
  year!: number;

  @Column('bigint')
  priceLak!: string;

  @Column({ default: 'LAK' })
  currency!: string;

  @Column({ nullable: true })
  mileageKm?: number;

  @Column({ nullable: true })
  fuelType?: string;

  @Column({ nullable: true })
  transmission?: string;

  @Column({ nullable: true })
  bodyType?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: CarStatus, default: CarStatus.Pending })
  status!: CarStatus;

  @Column({ default: false })
  isFeatured!: boolean;

  @Column({ default: false })
  isLimitedStock!: boolean;

  @Column({ default: 0 })
  viewCount!: number;

  @Column({ default: 0 })
  clickCount!: number;

  @OneToMany(() => CarImage, (image) => image.car, { cascade: true })
  images!: CarImage[];

  @OneToMany(() => Lead, (lead) => lead.car)
  leads!: Lead[];

  @OneToMany(() => Booking, (booking) => booking.car)
  bookings!: Booking[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

