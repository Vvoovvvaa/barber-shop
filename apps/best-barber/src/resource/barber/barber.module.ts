import { Module } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Barber, BarberSchema, User, UserSchema } from '@app/common-barber/database/schemas';
import { AuthModule } from '../auth/auth.module';
import { S3Module } from '@app/common-barber/s3';
import { UserImage, UserImageSchema } from '@app/common-barber/database/schemas/s3-image';
import { SenderService } from '@app/common-barber/email/sender.service';
import { EmailModule } from '@app/common-barber/email/email.module';
import { changeStatusService } from './services/change-status.service';
import { CreateBarberService } from './services/create-barber-service.service';
import { findBarberService } from './services/find-barber.service';
import { handleImageUploadservice } from './services/handle-Image-Upload.service';
import { removeService } from './services/remove.service';
import { UpdateBarberService } from './services/update-service.service';

@Module({
  imports: [
    AuthModule,
    S3Module,
    EmailModule,
    MongooseModule.forFeature([
      { name: Barber.name, schema: BarberSchema },
      { name: User.name, schema: UserSchema },
      { name: UserImage.name, schema: UserImageSchema }
    ])],
  controllers: [BarberController],
  providers: [BarberService, changeStatusService, CreateBarberService, findBarberService, handleImageUploadservice, removeService, UpdateBarberService],
})
export class BarberModule { }


