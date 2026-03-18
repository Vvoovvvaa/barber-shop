import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateAppointmentDto } from "./dto/appoitment.dto";
import { AppointmentStatusDTO } from "./dto/status.dto";
import { Appointment,Barber,User } from "@app/common-barber/database/schemas";;
import { status } from "@app/common-barber/database/enums";
import { BarberService } from "@app/common-barber/database/schemas/barber-service";


@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(BarberService.name)
    private readonly barberServiceModel: Model<BarberService>,
  ) {}


  async createAppointment(clientId: string, dto: CreateAppointmentDto) {
    const service = await this.barberServiceModel.findById(dto.serviceId);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.appointmentModel.create({
      client: clientId,
      barber: service.barber,
      service: service._id,
      startTime: dto.startTime,
    });
  }


  async removeAppointment(clientId: string, appointmentId: string) {
    const appointment = await this.appointmentModel.findById(appointmentId);

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.client.toString() !== clientId) {
      throw new ForbiddenException('You cannot delete this appointment');
    }

    await appointment.deleteOne();
    return { message: 'Appointment deleted' };
  }


  async acceptedOrRejected(
    barberId: string,
    appointmentId: string,
    dto: AppointmentStatusDTO,
  ) {
    const appointment = await this.appointmentModel.findOne({
      _id: appointmentId,
      barber: barberId,
    });

    if (!appointment) {
      throw new ForbiddenException(
        'You cannot update this appointment',
      );
    }

    appointment.status = dto.status;
    return appointment.save();
  }


  async getAppointmentsForBarber(barberId: string) {
    return this.appointmentModel
      .find({ barber: barberId })
      .populate('client')
      .populate('service');
  }

  async getAppointmentsForClient(clientId: string) {
    return this.appointmentModel
      .find({ client: clientId })
      .populate('barber')
      .populate('service');
  }

  async getAppointmentsForUser(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === status.BARBER) {
      return this.getAppointmentsForBarber(userId);
    }

    return this.getAppointmentsForClient(userId);
  }
}