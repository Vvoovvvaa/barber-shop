import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Appointment } from '@app/common-barber/database/schemas';
import { CreateAppointmentDto } from '../dto/appoitment.dto';

@Injectable()
export class AppointmentLifeService {
    constructor(
        @InjectModel(Appointment.name)
        private readonly appointmentModel: Model<Appointment>,
    ) { }

    async createAppointment(clientId: string, dto: CreateAppointmentDto) {
        const existing = await this.appointmentModel.create({
            client: clientId,
            barber: dto.barberId,
            service: dto.service,
            startTime: dto.date,
        });

        if (existing) {
            throw new BadRequestException('Time slot already booked')
        }
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

}