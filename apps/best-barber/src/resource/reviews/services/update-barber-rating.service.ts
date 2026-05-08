import { Injectable } from "@nestjs/common";
import { BarberRepository } from "../reposytories/barber.repository";

@Injectable()
export class UpdateBarberRatingService {
  constructor(private readonly barberRepo: BarberRepository) {}

  async updateBarberRating(barberId: string, rating: number) {
    const barber = await this.barberRepo.findById(barberId);

    if (!barber) return;

    const count = barber.retingCount || 0;
    const avg = barber.retingAvd || 0;

    const total = avg * count;

    barber.retingCount = count + 1;
    barber.retingAvd = (total + rating) / barber.retingCount;

    await this.barberRepo.save(barber);
  }
}