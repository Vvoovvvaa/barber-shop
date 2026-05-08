import { Appointment } from "@app/common-barber";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class AppointmentRepository {
  constructor(
    @InjectModel(Appointment.name)
    private readonly model: Model<Appointment>
  ) {}

  findById(id: string) {
    return this.model.findById(id);
  }
}