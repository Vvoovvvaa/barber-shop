import { Appointment } from "@app/common-barber";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppointmentStatusDTO } from "../dto/status.dto";

@Injectable()
export class AppointmentAcceptService {
    constructor(
        @InjectModel(Appointment.name)
        private readonly appointmentModel: Model<Appointment>
    ) { }

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

}