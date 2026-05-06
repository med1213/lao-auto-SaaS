import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BillingCycle } from '../common/enums';
import { Tenant } from '../tenants/tenant.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tenantId!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @Column()
  planId!: string;

  @ManyToOne(() => SubscriptionPlan, (plan) => plan.payments)
  @JoinColumn({ name: 'planId' })
  plan!: SubscriptionPlan;

  @Column('bigint')
  amountLak!: string;

  @Column({ type: 'enum', enum: BillingCycle, default: BillingCycle.Monthly })
  billingCycle!: BillingCycle;

  @Column({ default: 'pending' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

