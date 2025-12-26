import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from './validation/validation.schema';
import { jwtConfig, mongoConfig } from './configs';
// import { UserModule } from './user/user.module';
import { AuthModule } from './resource/auth/auth.module';
import { BarberModule } from './resource/barber/barber.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      load: [mongoConfig, jwtConfig],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mongo = config.get('mongo');
        if (!mongo) {
          throw new Error('Mongo config not found');
        }
        return {
          uri: mongo.uri,
          dbName: mongo.dbName,
          retryAttempts: 5,
          retryDelay: 3000,
          serverSelectionTimeoutMS: 5000,
        };
      },
    }),
    AuthModule,
    BarberModule,
    // UserModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }