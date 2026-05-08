import { Injectable } from '@nestjs/common';

import { CreateReviewService } from './services/create-review.service';
import { CretaeReviewDto } from './dto/review-dto';
import { UpdateBarberRatingService } from './services/update-barber-rating.service';

@Injectable()
export class ReviewsService {
    constructor(
        private readonly createReviewService: CreateReviewService,
        private readonly updateBarberratingservice: UpdateBarberRatingService
    ) { }

    async updateBarberRating(barberId: string, rating: number) {
        return this.updateBarberratingservice.updateBarberRating(barberId,rating)
    }


    async createReview(userId: string, dto: CretaeReviewDto) {
        return this.createReviewService.createReview(userId,dto)
    }
}
