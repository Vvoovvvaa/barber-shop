import { Injectable } from '@nestjs/common';

@Injectable()
export class BarberAdminService {
  getHello(): string {
    return 'Hello World!';
  }
}
