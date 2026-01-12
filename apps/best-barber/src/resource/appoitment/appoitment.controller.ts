import { Controller, Get, Post, Body, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { AppoitmentService } from './appoitment.service';
import { AuthUser } from '@app/common-barber';
import { AuthGuard } from '@app/common-barber';
import { CreateAppointmentDto } from './dto/appoitment.dto';
import { AppointmentStatusDTO } from './dto/status.dto';
import { IdDto } from '@app/common-barber/dto/parap-id.dto';

@UseGuards(AuthGuard)
@Controller('appointment')
export class AppoitmentController {
  constructor(private readonly appointmentService: AppoitmentService) { }

  @Post()
  async createAppointment(@AuthUser('id') id: string, @Body() dto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(id, dto)
  }

  @Delete(':id')
  async removeAppointment(@AuthUser('id') id: string, @Param() param: IdDto) {
    return this.appointmentService.removeAppointment(id, param.id)
  }

  @Patch('/:id')
  async acceptedOrRejected(@AuthUser('id') id: string, @Param() param: IdDto, @Body()dto: AppointmentStatusDTO) {
    return this.appointmentService.acceptedOrRejected(id, param.id, dto)
  }

  @Get()
  async getAppointmentForUser(@AuthUser('id') id: string){
    return this.appointmentService.getAppointmentsForUser(id)
  }

}
