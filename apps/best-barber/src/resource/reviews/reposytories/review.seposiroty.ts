import { Review } from "@app/common-barber";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel(Review.name)
    private readonly model: Model<Review>
  ) {}

  findByAppointmentId(id: string) {
    return this.model.findOne({ appointmentId: id });
  }

  create(data: any) {
    return this.model.create(data);
  }
}