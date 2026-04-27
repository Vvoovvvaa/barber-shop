import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Admin, AdminSchema } from '@app/common-barber'; 
import { AdminSecurity, AdminSecuritySchema } from '@app/common-barber/database/schemas/admin-security';
import { AdminRepository } from './repositories/admin.repository';
import { PasswordService } from './services/password.service';
import { SecurityService } from './repositories/security.repository';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: AdminSecurity.name, schema: AdminSecuritySchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminRepository,
    SecurityService,
    PasswordService,
    TokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}