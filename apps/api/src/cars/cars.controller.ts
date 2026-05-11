import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CarStatus, UserRole } from '../common/enums';
import { JwtUser } from '../common/jwt-user.type';
import { carImageStorage, imageFileFilter } from './upload.config';
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin, UserRole.DealerAdmin, UserRole.DealerStaff)
  dealerCars(@CurrentUser() user: JwtUser) {
    return this.cars.dealerCars(user);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.cars.findPublic(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin, UserRole.DealerAdmin, UserRole.DealerStaff)
  create(@Body() dto: CreateCarDto, @CurrentUser() user: JwtUser) {
    return this.cars.create(dto, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin, UserRole.DealerAdmin, UserRole.DealerStaff)
  update(@Param('id') id: string, @Body() dto: Partial<CreateCarDto>, @CurrentUser() user: JwtUser) {
    return this.cars.update(id, dto, user);
  }

  @Patch(':id/status/:status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  approve(@Param('id') id: string, @Param('status') status: CarStatus) {
    return this.cars.approve(id, status);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin, UserRole.DealerAdmin)
  remove(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.cars.remove(id, user);
  }

  // ─── Image Upload ─────────────────────────────────────────────────────────

  @Post(':id/images/upload')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin, UserRole.DealerAdmin, UserRole.DealerStaff)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: carImageStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
    })
  )
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtUser
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.cars.addImage(id, file.filename, user);
  }

  @Delete(':carId/images/:imageId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin, UserRole.DealerAdmin, UserRole.DealerStaff)
  removeImage(
    @Param('carId') carId: string,
    @Param('imageId') imageId: string,
    @CurrentUser() user: JwtUser
  ) {
    return this.cars.removeImage(carId, imageId, user);
  }
}
