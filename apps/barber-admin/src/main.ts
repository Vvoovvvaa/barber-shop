import { NestFactory } from '@nestjs/core';
import { BarberAdminModule } from './barber-admin.module';

const PORT = process.env.ADMIN_PORT || 5000
async function bootstrap() {
  const app = await NestFactory.create(BarberAdminModule);
  await app.listen(+PORT);
  console.log("Admin running on port",PORT)
}
bootstrap();
