import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Admin, AdminSchema, AdminSecurity, AdminSecuritySchema} from '@app/common-barber';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
  MongooseModule.forFeature([
    { name: Admin.name, schema: AdminSchema },
    { name: AdminSecurity.name, schema: AdminSecuritySchema }
  ]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService]
})
export class AdminsModule { }
