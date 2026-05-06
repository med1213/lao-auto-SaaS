import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Promotion } from './promotion.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan, Payment, Promotion])]
})
export class SubscriptionsModule {}

