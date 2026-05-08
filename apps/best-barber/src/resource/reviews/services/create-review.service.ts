import { AppointmentStatus, endOrder } from "@app/common-barber";
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { CretaeReviewDto } from "../dto/review-dto";
import { AppointmentRepository } from "../reposytories/appointment.repository";
import { ReviewRepository } from "../reposytories/review.seposiroty";
import { UpdateBarberRatingService } from "./update-barber-rating.service";

@Injectable()
export class CreateReviewService {
  constructor(
    private readonly appointmentRepo: AppointmentRepository,
    private readonly reviewRepo: ReviewRepository,
    private readonly updateRatingService: UpdateBarberRatingService
  ) {}

  async createReview(userId: string, dto: CretaeReviewDto) {
    const appoitment = await this.appointmentRepo.findById(dto.appointmentId);

    if (!appoitment) {
      throw new NotFoundException("Appoitment not found");
    }

    if (appoitment.client.toString() !== userId) {
      throw new ForbiddenException("Not your appoitment");
    }

    if (appoitment.status !== AppointmentStatus.COMPLETED) {
      throw new BadRequestException("Not completed");
    }

    if (appoitment.end !== endOrder.ENDWORK) {
      throw new BadRequestException("Invalid end");
    }

    const existing = await this.reviewRepo.findByAppointmentId(dto.appointmentId);

    if (existing) {
      throw new BadRequestException("Review already exists");
    }

    const review = await this.reviewRepo.create({
      appointmentId: dto.appointmentId,
      clientId: userId,
      barberId: appoitment.barber,
      rating: dto.rating,
      comment: dto.comment,
    });

    await this.updateRatingService.updateBarberRating(
      appoitment.barber.toString(),
      dto.rating
    );

    return review;
  }
}