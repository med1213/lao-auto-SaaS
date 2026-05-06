import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CarStatus, UserRole } from '../common/enums';
import { JwtUser } from '../common/jwt-user.type';
import { CarsService } from './cars.service';
import { CarQueryDto } from './dto/car-query.dto';
import { CreateCarDto } from './dto/create-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly cars: CarsService) {}

  @Get()
  search(@Query() query: CarQueryDto) {
    return this.cars.publicSearch(query);
  }

  @Get('dealer/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DealerAdmin, UserRole.DealerStaff)
  dealerCars(@CurrentUser() user: JwtUser) {
    return this.cars.dealerCars(user);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.cars.findPublic(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DealerAdmin, UserRole.DealerStaff)
  create(@Body() dto: CreateCarDto, @CurrentUser() user: JwtUser) {
    return this.cars.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin, UserRole.DealerAdmin, UserRole.DealerStaff)
  update(@Param('id') id: string, @Body() dto: Partial<CreateCarDto>, @CurrentUser() user: JwtUser) {
    return this.cars.update(id, dto, user);
  }

  @Patch(':id/status/:status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  approve(@Param('id') id: string, @Param('status') status: CarStatus) {
    return this.cars.approve(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin, UserRole.DealerAdmin)
  remove(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.cars.remove(id, user);
  }
}

