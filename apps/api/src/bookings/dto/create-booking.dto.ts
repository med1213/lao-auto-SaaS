import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  tenantId!: string;

  @IsString()
  carId!: string;

  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @Type(() => Date)
  @IsDate()
  preferredAt!: Date;
}

