import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Car } from './car.entity';

@Entity('car_images')
export class CarImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  carId!: string;

  @ManyToOne(() => Car, (car) => car.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car!: Car;

  @Column()
  url!: string;

  @Column({ default: 0 })
  sortOrder!: number;

  @Column({ default: false })
  isPrimary!: boolean;
}

