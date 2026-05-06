import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class CarImageDto {
  @IsString()
  url!: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreateCarDto {
  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsString()
  trim!: string;

  @IsInt()
  @Min(1900)
  year!: number;

  @IsString()
  priceLak!: string;

  @IsOptional()
  @IsInt()
  mileageKm?: number;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsString()
  transmission?: string;

  @IsOptional()
  @IsString()
  bodyType?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isLimitedStock?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarImageDto)
  images?: CarImageDto[];
}

