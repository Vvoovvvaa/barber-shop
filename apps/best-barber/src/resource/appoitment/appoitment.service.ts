import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateAppointmentDto } from "./dto/appoitment.dto";
import { AppointmentStatusDTO } from "./dto/status.dto";
import { Appointment, Barber, User } from "@app/common-barber/database/schemas";;
import { AppointmentStatus, endOrder, status } from "@app/common-barber/database/enums";
import { BarberService } from "@app/common-barber/database/schemas/barber-service";
import { EndOrderDTO } from "./dto/end-order.dto";
import { SenderService } from "@app/common-barber/email/sender.service";


@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(BarberService.name)
    private readonly barberServiceModel: Model<BarberService>,
    private readonly sendservice:SenderService
  ) { }


  async createAppointment(clientId: string, dto: CreateAppointmentDto) {
    // const service = await this.barberServiceModel.findById(dto.);

    // if (!service) {
    //   throw new NotFoundException('Service not found');
    // }

    return this.appointmentModel.create({
      client: clientId,
      barber: dto.barberId,
      service: dto.service,
      startTime: dto.date,
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

  async endOfOrder(barberId: string, dto: EndOrderDTO) {
  const { appointmentId, result, priceOfWork } = dto;

  const appointment = await this.appointmentModel
    .findById(appointmentId)
    .populate('client');

  if (!appointment) {
    throw new NotFoundException('Appointment not found!');
  }

  if (appointment.barber.toString() !== barberId) {
    throw new ForbiddenException('This appointment is not yours');
  }

  if (appointment.end) {
    throw new BadRequestException('Appointment already finished');
  }

  const price = result === endOrder.ENDWORK ? priceOfWork : 0;

  const updated = await this.appointmentModel.findByIdAndUpdate(
    appointmentId,
    {
      $set: {
        end: result,
        status: AppointmentStatus.COMPLETED,
      },
    },
    { new: true },
  );

  const client = appointment.client as any;

  if (client.email) {
    await this.sendservice.sendEmail({
      to: client.email,
      from: process.env.SMTP_FROM || 'no-reply@example.com',
      subject: 'Your receipt',
      template: 'receipt',
      context: {
        name: client.name || 'User',
        price,
      },
    });
  }

  return updated;
}
}








