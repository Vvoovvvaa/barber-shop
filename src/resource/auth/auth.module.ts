import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSessionSchema, User, UserSchema } from 'src/database/schemas';
import { AuthGuard } from 'src/guard';
import { IJWTConfig } from 'src/models';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const jwt = config.get<IJWTConfig>('JWT_CONFIG');
        if (!jwt) {
          throw new Error('JWT_CONFIG not found');
        }
        return {
          secret: jwt.secret,
          signOptions: { expiresIn: jwt.expiresIn },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSessionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports:[AuthGuard,JwtModule]
})
export class AuthModule {}