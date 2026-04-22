import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSessionSchema, User, UserSchema, UserSecurity, UserSecuritySchema } from '@app/common-barber/database/schemas';
import { AuthGuard } from '@app/common-barber';
import { RedisModule} from '@app/redis';
import { EmailModule } from '@app/common-barber/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSessionSchema },
      { name: User.name, schema: UserSchema },
      { name: UserSecurity.name, schema: UserSecuritySchema }
    ]),RedisModule,EmailModule
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthGuard,AuthService]
})
export class AuthModule {}