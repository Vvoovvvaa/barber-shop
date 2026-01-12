import { Module } from '@nestjs/common';
import { AppoitmentService } from './appoitment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema, Barber, BarberSchema, User,UserSchema } from 'src/database/schemas';
import { AppoitmentController } from './appoitment.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema},
      { name: Barber.name, schema:BarberSchema}
    ]),
  ],
  controllers: [AppoitmentController],
  providers: [AppoitmentService],
})
export class AppoitmentModule {}
