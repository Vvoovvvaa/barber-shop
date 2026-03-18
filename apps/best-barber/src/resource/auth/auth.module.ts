import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSessionSchema, User, UserSchema, userSecurity, userSecuritySchema } from '@app/common-barber/database/schemas';
import { AuthGuard } from '@app/common-barber';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSessionSchema },
      { name: User.name, schema: UserSchema },
      { name: userSecurity.name, schema: userSecuritySchema }
    ]),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthGuard,AuthService]
})
export class AuthModule {}