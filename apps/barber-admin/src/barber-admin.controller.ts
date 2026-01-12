import { Controller, Get } from '@nestjs/common';
import { BarberAdminService } from './barber-admin.service';

@Controller()
export class BarberAdminController {
  constructor(private readonly barberAdminService: BarberAdminService) {}

  @Get()
  getHello(): string {
    return this.barberAdminService.getHello();
  }
}
