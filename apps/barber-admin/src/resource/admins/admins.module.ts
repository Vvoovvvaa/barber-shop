import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Admin, AdminSchema, AdminSecurity, AdminSecuritySchema, Appointment, AppointmentSchema, Barber, BarberSchema, User, UserSchema, UserSecurity, UserSecuritySchema } from '@app/common-barber';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule, RedisService, TokenService } from '@app/redis';
import Redis from 'ioredis';
import { AdminBlockService } from './services/admin-block.service';
import { BarberManagementService } from './services/barber-management.service';
import { UserManagementService } from './services/user-management.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: AdminSecurity.name, schema: AdminSecuritySchema },
      { name: User.name, schema: UserSchema },
      { name: Barber.name, schema: BarberSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: UserSecurity.name, schema: UserSecuritySchema }
    ]), RedisModule
  ],
  controllers: [AdminsController],
  providers: [AdminsService, AdminBlockService, BarberManagementService, UserManagementService,],
  exports: [AdminsService]
})
export class AdminsModule { }
