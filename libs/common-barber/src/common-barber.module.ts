import { Module } from '@nestjs/common';
import { CommonBarberService } from './common-barber.service';
import { EmailModule } from './email/email.module';
@Module({
  providers: [CommonBarberService],
  exports: [CommonBarberService],
  imports: [EmailModule],
})
export class CommonBarberModule {}
