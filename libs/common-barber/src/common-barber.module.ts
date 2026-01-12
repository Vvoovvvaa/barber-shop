import { Module } from '@nestjs/common';
import { CommonBarberService } from './common-barber.service';

@Module({
  providers: [CommonBarberService],
  exports: [CommonBarberService],
})
export class CommonBarberModule {}
