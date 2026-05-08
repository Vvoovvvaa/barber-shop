import { Injectable  } from "@nestjs/common";

import { CreateAppointmentDto } from "./dto/appoitment.dto";
import { AppointmentStatusDTO } from "./dto/status.dto";
import { EndOrderDTO } from "./dto/end-order.dto";
import { AppointmentLifeService } from "./services/appoitment-life.service";
import { AppointmentAcceptService } from "./services/appoitment-accept.service";
import { AppointmentViewService } from "./services/appoitment-view.service";
import { AppointmentEndOrderService } from "./services/appointment-endorder.service";


@Injectable()
export class AppointmentService {

  constructor(
    private readonly appointmentLifeService: AppointmentLifeService,
    private readonly appointmentAcceptservice: AppointmentAcceptService,
    private readonly appointmentViewServie: AppointmentViewService,
    private readonly appointmentEndOrderservice: AppointmentEndOrderService
  ) { }


  createAppointment(clientId: string, dto: CreateAppointmentDto) {
    return this.appointmentLifeService.createAppointment(clientId, dto)
  }

  removeAppointment(clientId: string, appointmentId: string) {
    return this.appointmentLifeService.removeAppointment(clientId,appointmentId)
  }

  acceptedOrRejected(barberId: string,appointmentId: string,dto: AppointmentStatusDTO) {
   return this.appointmentAcceptservice.acceptedOrRejected(barberId,appointmentId,dto)
  }


  getAppointmentsForBarber(barberId: string) {
    return this.appointmentViewServie.getAppointmentsForBarber(barberId)
  }

  getAppointmentsForClient(clientId: string) {
    return this.appointmentViewServie.getAppointmentsForClient(clientId)
  }

  async getAppointmentsForUser(userId: string) {
    return this.appointmentViewServie.getAppointmentsForUser(userId)
  }

  async endOfOrder(barberId: string, dto: EndOrderDTO) {
    return this.appointmentEndOrderservice.endOfOrder(barberId,dto)
  } 
}








