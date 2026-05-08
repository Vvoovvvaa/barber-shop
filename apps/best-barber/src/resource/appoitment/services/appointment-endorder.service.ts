import { endOrder, AppointmentStatus, Appointment, SenderService } from "@app/common-barber";
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { EndOrderDTO } from "../dto/end-order.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class AppointmentEndOrderService {
    constructor(
        @InjectModel(Appointment.name)
        private readonly appointmentModel: Model<Appointment>,
        private readonly sendservice: SenderService

    ) { }

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