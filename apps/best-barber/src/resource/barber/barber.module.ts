import { Module } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Barber, BarberSchema, User, UserSchema } from '@app/common-barber/database/schemas';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[
    AuthModule,
    MongooseModule.forFeature([
      {name:Barber.name,schema: BarberSchema},
      {name:User.name,schema: UserSchema}
  ])],
  controllers: [BarberController],
  providers: [BarberService],
})
export class BarberModule {}


