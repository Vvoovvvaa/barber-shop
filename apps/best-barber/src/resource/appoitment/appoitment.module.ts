import { Module } from '@nestjs/common';
import { AppointmentService } from './appoitment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema, Barber, BarberSchema, User,UserSchema } from '@app/common-barber/database/schemas';
import { AppoitmentController } from './appoitment.controller';
import { AuthModule } from '../auth/auth.module';
import { BarberService } from '../barber/barber.service';
import { BarberServiceSchema } from '@app/common-barber/database/schemas/barber-service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema},
      { name: BarberService.name, schema:BarberServiceSchema}
    ]),
  ],
  controllers: [AppoitmentController],
  providers: [AppointmentService],
})
export class AppoitmentModule {}
