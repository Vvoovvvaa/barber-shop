import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppointmentService } from './appoitment.service';
import { Appointment, AppointmentSchema, User, UserSchema } from '@app/common-barber/database/schemas';
import { AppoitmentController } from './appoitment.controller';
import { AuthModule } from '../auth/auth.module';
import { BarberService } from '../barber/barber.service';
import { BarberServiceSchema } from '@app/common-barber/database/schemas/barber-service';
import { EmailModule } from '@app/common-barber/email/email.module';
import { AppointmentAcceptService } from './services/appoitment-accept.service';
import { AppointmentEndOrderService } from './services/appointment-endorder.service';
import { AppointmentLifeService } from './services/appoitment-life.service';
import { AppointmentViewService } from './services/appoitment-view.service';

@Module({
  imports: [
    AuthModule,
    EmailModule,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
      { name: BarberService.name, schema: BarberServiceSchema },
    ]),
  ],
  controllers: [AppoitmentController],
  providers: [AppointmentService, AppointmentAcceptService, AppointmentEndOrderService, AppointmentLifeService, AppointmentViewService],
})
export class AppoitmentModule { }
