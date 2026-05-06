import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Car } from '../cars/car.entity';
import { BookingStatus } from '../common/enums';
import { Tenant } from '../tenants/tenant.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  tenantId!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @Column()
  carId!: string;

  @ManyToOne(() => Car, (car) => car.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car!: Car;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column({ type: 'timestamptz' })
  preferredAt!: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.Requested })
  status!: BookingStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

