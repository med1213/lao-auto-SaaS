import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtUser } from '../common/jwt-user.type';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookings: Repository<Booking>,
    private readonly realtime: RealtimeGateway
  ) {}

  async create(dto: CreateBookingDto) {
    const booking = await this.bookings.save(this.bookings.create(dto));
    this.realtime.notifyTenant(dto.tenantId, 'booking.created', booking);
    return booking;
  }

  findForDealer(user: JwtUser) {
    if (!user.tenantId) throw new ForbiddenException('Tenant required');
    return this.bookings.find({
      where: { tenantId: user.tenantId },
      relations: { car: true },
      order: { createdAt: 'DESC' }
    });
  }
}

