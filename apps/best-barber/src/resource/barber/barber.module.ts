import { Module } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Barber, BarberSchema, User, UserSchema } from '@app/common-barber/database/schemas';
import { AuthModule } from '../auth/auth.module';
import { S3Module } from '@app/common-barber/s3';
import { UserImage, UserImageSchema } from '@app/common-barber/database/schemas/s3-image';

@Module({
  imports:[
    AuthModule,
    S3Module,
    MongooseModule.forFeature([
      {name:Barber.name,schema: BarberSchema},
      {name:User.name,schema: UserSchema},
      {name:UserImage.name,schema: UserImageSchema}
  ])],
  controllers: [BarberController],
  providers: [BarberService],
})
export class BarberModule {}


