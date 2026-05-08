import { Appointment, status, User } from "@app/common-barber";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class AppointmentViewService {
    constructor(
        @InjectModel(Appointment.name)
        private readonly appointmentModel: Model<Appointment>,
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) { }


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
