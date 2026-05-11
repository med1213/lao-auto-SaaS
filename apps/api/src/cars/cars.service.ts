import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CarStatus, UserRole } from '../common/enums';
import { JwtUser } from '../common/jwt-user.type';
import { CarImage } from './car-image.entity';
import { Car } from './car.entity';
import { Tenant } from '../tenants/tenant.entity';
import { CarQueryDto } from './dto/car-query.dto';
import { CreateCarDto } from './dto/create-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private readonly cars: Repository<Car>,
    @InjectRepository(CarImage) private readonly carImages: Repository<CarImage>,
    @InjectRepository(Tenant) private readonly tenants: Repository<Tenant>
  ) {}

  async publicSearch(query: CarQueryDto) {
    const qb = this.cars
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.images', 'images')
      .leftJoinAndSelect('car.tenant', 'tenant')
      .where('car.status = :status', { status: CarStatus.Published })
      .orderBy('car.isFeatured', 'DESC')
      .addOrderBy('car.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(Math.min(query.limit, 48));

    if (query.dealer) qb.andWhere('tenant.slug = :dealer', { dealer: query.dealer });
    if (query.make) qb.andWhere('LOWER(car.make) = LOWER(:make)', { make: query.make });
    if (query.featured === 'true') qb.andWhere('car.isFeatured = true');
    if (query.minPrice) qb.andWhere('car.priceLak >= :minPrice', { minPrice: query.minPrice });
    if (query.maxPrice) qb.andWhere('car.priceLak <= :maxPrice', { maxPrice: query.maxPrice });
    if (query.q) {
      qb.andWhere(
        new Brackets((w) => {
          w.where('car.make ILIKE :q', { q: `%${query.q}%` })
            .orWhere('car.model ILIKE :q', { q: `%${query.q}%` })
            .orWhere('car.trim ILIKE :q', { q: `%${query.q}%` });
        })
      );
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: query.page, limit: query.limit };
  }

  async findPublic(id: string) {
    const car = await this.cars.findOne({
      where: { id, status: CarStatus.Published },
      relations: { images: true, tenant: true }
    });
    if (!car) throw new NotFoundException('Car not found');
    await this.cars.increment({ id }, 'viewCount', 1);
    return car;
  }

  async dealerCars(user: JwtUser) {
    let tenantId = user.tenantId;
    if (user.role === UserRole.SuperAdmin && !tenantId) {
      const firstTenant = await this.tenants.findOne({ where: {} });
      if (firstTenant) tenantId = firstTenant.id;
    }
    if (!tenantId) throw new ForbiddenException('Tenant required');
    return this.cars.find({
      where: { tenantId },
      relations: { images: true },
      order: { createdAt: 'DESC' }
    });
  }

  async create(dto: CreateCarDto, user: JwtUser) {
    let tenantId = user.role === UserRole.SuperAdmin && dto.tenantId ? dto.tenantId : user.tenantId;
    if (user.role === UserRole.SuperAdmin && !tenantId) {
      const firstTenant = await this.tenants.findOne({ where: {} });
      if (firstTenant) tenantId = firstTenant.id;
    }
    if (!tenantId) throw new ForbiddenException('Tenant required');

    const car = this.cars.create({
      ...dto,
      tenantId,
      status: user.role === UserRole.SuperAdmin ? CarStatus.Published : CarStatus.Pending,
      images: dto.images?.map((image, sortOrder) => ({ ...image, sortOrder }))
    });
    return this.cars.save(car);
  }

  async update(id: string, dto: Partial<CreateCarDto>, user: JwtUser) {
    const car = await this.cars.findOne({ where: { id }, relations: { images: true } });
    if (!car) throw new NotFoundException('Car not found');
    if (user.role !== UserRole.SuperAdmin && car.tenantId !== user.tenantId) {
      throw new ForbiddenException('Wrong tenant');
    }
    Object.assign(car, dto, { status: user.role === UserRole.SuperAdmin ? car.status : CarStatus.Pending });
    return this.cars.save(car);
  }

  async remove(id: string, user: JwtUser) {
    const car = await this.cars.findOneBy({ id });
    if (!car) throw new NotFoundException('Car not found');
    if (user.role !== UserRole.SuperAdmin && car.tenantId !== user.tenantId) {
      throw new ForbiddenException('Wrong tenant');
    }
    await this.cars.delete(id);
    return { deleted: true };
  }

  approve(id: string, status: CarStatus) {
    return this.cars.update(id, { status });
  }

  /** Add an uploaded file as a CarImage record linked to the given car */
  async addImage(carId: string, filename: string, user: JwtUser): Promise<CarImage> {
    const car = await this.cars.findOne({ where: { id: carId }, relations: { images: true } });
    if (!car) throw new NotFoundException('Car not found');
    if (user.role !== UserRole.SuperAdmin && car.tenantId !== user.tenantId) {
      throw new ForbiddenException('Wrong tenant');
    }

    const isPrimary = car.images.length === 0;
    const sortOrder = car.images.length;
    const url = `/uploads/cars/${filename}`;

    const image = this.carImages.create({ carId, url, isPrimary, sortOrder });
    return this.carImages.save(image);
  }

  /** Delete a specific image from a car */
  async removeImage(carId: string, imageId: string, user: JwtUser) {
    const car = await this.cars.findOneBy({ id: carId });
    if (!car) throw new NotFoundException('Car not found');
    if (user.role !== UserRole.SuperAdmin && car.tenantId !== user.tenantId) {
      throw new ForbiddenException('Wrong tenant');
    }
    await this.carImages.delete({ id: imageId, carId });
    return { deleted: true };
  }
}
