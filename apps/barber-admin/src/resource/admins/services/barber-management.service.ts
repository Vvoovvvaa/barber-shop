import { Barber, Appointment } from "@app/common-barber";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BarberManagementService {
  constructor(
    @InjectModel(Barber.name)
    private readonly barberModel: Model<Barber>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
  ) {}

  async deleteService(serviceId: string) {
    const service = await this.barberModel.findById(serviceId);

    if (!service) throw new NotFoundException('service not found');

    await this.appointmentModel.deleteMany({
      service: String(service._id),
    });

    await this.barberModel.findByIdAndDelete(service._id);

    return { message: 'service deleted' };
  }
}