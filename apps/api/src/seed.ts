import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Tenant } from './tenants/tenant.entity';
import { UserRole } from './common/enums';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const tenantRepository = app.get<Repository<Tenant>>(getRepositoryToken(Tenant));

  console.log('Starting database seeding...');

  // Create a default tenant
  let tenant = await tenantRepository.findOne({ where: { slug: 'vientiane-motors' } });
  if (!tenant) {
    tenant = tenantRepository.create({
      name: 'Vientiane Motors',
      slug: 'vientiane-motors',
      isActive: true,
    });
    tenant = await tenantRepository.save(tenant);
    console.log('✅ Created Tenant: Vientiane Motors');
  } else {
    console.log('✅ Tenant already exists: Vientiane Motors');
  }

  const passwordHash = bcrypt.hashSync('password123', 10);

  // Create Super Admin
  const existingSuperAdmin = await userRepository.findOne({ where: { email: 'admin@laoauto.com' } });
  if (!existingSuperAdmin) {
    const superAdmin = userRepository.create({
      name: 'Super Admin',
      email: 'admin@laoauto.com',
      passwordHash,
      role: UserRole.SuperAdmin,
      isActive: true,
    });
    await userRepository.save(superAdmin);
    console.log('✅ Created Super Admin: admin@laoauto.com (password123)');
  } else {
    console.log('✅ Super Admin already exists.');
  }

  // Create Dealer Admin
  const existingDealerAdmin = await userRepository.findOne({ where: { email: 'dealer@laoauto.com' } });
  if (!existingDealerAdmin) {
    const dealerAdmin = userRepository.create({
      name: 'Dealer Admin',
      email: 'dealer@laoauto.com',
      passwordHash,
      role: UserRole.DealerAdmin,
      tenantId: tenant.id,
      isActive: true,
    });
    await userRepository.save(dealerAdmin);
    console.log('✅ Created Dealer Admin: dealer@laoauto.com (password123)');
  } else {
    console.log('✅ Dealer Admin already exists.');
  }

  console.log('Seeding completed successfully!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
