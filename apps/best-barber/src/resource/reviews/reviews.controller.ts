import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CretaeReviewDto } from './dto/review-dto';
import { AuthGuard } from '@app/common-barber';
import { AuthUser } from '@app/common-barber';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReview(
    @AuthUser('id') userId: string,
    @Body() dto: CretaeReviewDto,
  ) {
    return this.reviewsService.createReview(userId, dto);
  }
}