import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from '@app/common-barber/database/schemas/reviews';
import { Appointment, AppointmentSchema, Barber, BarberSchema, User, UserSchema } from '@app/common-barber';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Barber.name, schema: BarberSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule { }
