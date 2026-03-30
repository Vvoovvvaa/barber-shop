import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Admin, AdminSchema, AdminSecurity, AdminSecuritySchema, Appointment, AppointmentSchema, Barber, BarberSchema, User, UserSchema, userSecurity, userSecuritySchema } from '@app/common-barber';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule, RedisService, TokenService } from '@app/redis';
import Redis from 'ioredis';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: AdminSecurity.name, schema: AdminSecuritySchema },
      { name: User.name, schema: UserSchema },
      { name: Barber.name, schema: BarberSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      {name: userSecurity.name, schema: userSecuritySchema}
    ]),RedisModule
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService]
})
export class AdminsModule { }
