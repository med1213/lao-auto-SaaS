import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Payment } from './payment.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column('bigint')
  priceLak!: string;

  @Column()
  listingLimit!: number;

  @Column({ default: false })
  includesFeatured!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Payment, (payment) => payment.plan)
  payments!: Payment[];
}

