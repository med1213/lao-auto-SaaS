import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantsService {
  constructor(@InjectRepository(Tenant) private readonly tenants: Repository<Tenant>) {}

  findPublic() {
    return this.tenants.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  }

  findAll() {
    return this.tenants.find({ order: { createdAt: 'DESC' } });
  }

  async findBySlug(slug: string) {
    const tenant = await this.tenants.findOne({ where: { slug, isActive: true } });
    if (!tenant) throw new NotFoundException('Dealer not found');
    return tenant;
  }

  create(dto: CreateTenantDto) {
    return this.tenants.save(this.tenants.create(dto));
  }
}

