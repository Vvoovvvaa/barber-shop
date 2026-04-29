import { Appointment, AppointmentStatus, Barber, endOrder, Review, User } from '@app/common-barber';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CretaeReviewDto } from './dto/review-dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Barber.name)
        private readonly barbermdoel: Model<Barber>,

        @InjectModel(Appointment.name)
        private readonly appointmentmodel: Model<Appointment>,

        @InjectModel(User.name)
        private readonly userModel: Model<User>,

        @InjectModel(Review.name)
        private readonly reviewMdoel: Model<Review>
    ) { }

    async updateBarberRating(barberId: string, rating: number) {
        const barber = await this.barbermdoel.findById(barberId);

        if (!barber) return;

        const total = (barber.retingAvd|| 0) * (barber.retingCount || 0);

        barber.retingCount += 1;
        barber.retingAvd = (total + rating) / barber.retingCount;

        await barber.save();
    }


    async createReview(userId: string, dto: CretaeReviewDto) {
        const appoitment = await this.appointmentmodel.findById(dto.appointmentId)

        if (!appoitment) {
            throw new NotFoundException('Appoitment not found,please try again')
        }

        if (appoitment.client.toString() !== userId) {
            throw new ForbiddenException("Not your appoitment")
        }

        if (appoitment.status !== AppointmentStatus.COMPLETED) {
            throw new BadRequestException(`appoitment not completed`)
        }

        if (appoitment.end === endOrder.NOTCOME) {
            throw new BadRequestException(`Cliend didnt come`)
        }

        if (appoitment.end !== endOrder.ENDWORK) {
            throw new BadRequestException(`invalid end`)
        }

        const existing = await this.reviewMdoel.findOne({ appointmentId: dto.appointmentId })

        if (existing) {
            throw new BadRequestException(`review already exist`)
        }

        const review = await this.reviewMdoel.create({
            appointmentId: dto.appointmentId,
            clientId: userId,
            barberId: appoitment.barber,
            rating: dto.rating,
            comment: dto.comment
        })


        await this.updateBarberRating(appoitment.barber.toString(),dto.rating)

        return review


    }
}
