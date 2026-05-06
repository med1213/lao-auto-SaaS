import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtUser } from '../common/jwt-user.type';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Lead } from './lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead) private readonly leads: Repository<Lead>,
    private readonly realtime: RealtimeGateway
  ) {}

  async create(dto: CreateLeadDto) {
    const lead = await this.leads.save(this.leads.create(dto));
    this.realtime.notifyTenant(dto.tenantId, 'lead.created', lead);
    return lead;
  }

  findForDealer(user: JwtUser) {
    if (!user.tenantId) throw new ForbiddenException('Tenant required');
    return this.leads.find({
      where: { tenantId: user.tenantId },
      relations: { car: true },
      order: { createdAt: 'DESC' }
    });
  }
}

