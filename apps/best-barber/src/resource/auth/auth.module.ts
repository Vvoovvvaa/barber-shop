import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSessionSchema, User, UserSchema, UserSecurity, UserSecuritySchema } from '@app/common-barber/database/schemas';
import { AuthGuard } from '@app/common-barber';
import { RedisModule } from '@app/redis';
import { EmailModule } from '@app/common-barber/email/email.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Registrationservice } from './services/registration.service';
import { LoginSerice } from './services/login.service';
import { ViewAllUsers } from './services/all-user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSessionSchema },
      { name: User.name, schema: UserSchema },
      { name: UserSecurity.name, schema: UserSecuritySchema }
    ]), RedisModule, EmailModule
  ],
  providers: [AuthService, AuthGuard, Registrationservice, LoginSerice, ViewAllUsers],
  controllers: [AuthController],
  exports: [AuthGuard, AuthService]
})
export class AuthModule { }