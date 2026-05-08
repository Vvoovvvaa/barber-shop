import { Barber } from "@app/common-barber";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BarberRepository {
  constructor(
    @InjectModel(Barber.name)
    private readonly model: Model<Barber>
  ) {}

  findById(id: string) {
    return this.model.findById(id);
  }

  async save(barber: Barber) {
    await barber.save();
  }
}