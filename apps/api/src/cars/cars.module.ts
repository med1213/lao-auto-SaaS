import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtimeModule } from '../realtime/realtime.module';
import { Tenant } from '../tenants/tenant.entity';
import { CarImage } from './car-image.entity';
import { Car } from './car.entity';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  imports: [TypeOrmModule.forFeature([Car, CarImage, Tenant]), RealtimeModule],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService]
})
export class CarsModule {}

