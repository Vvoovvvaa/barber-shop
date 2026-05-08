import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { handleImageUploadservice } from "./handle-Image-Upload.service";
import { CreateBarberServiceDto } from "../dto/create-barber.dto";
import { status } from "@app/common-barber";
import { Barber, User } from "@app/common-barber";

@Injectable()
export class CreateBarberService { 
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,

        @InjectModel(Barber.name)
        private readonly barberModel: Model<Barber>,

        private readonly hanleIMageUpload:handleImageUploadservice
    ){}

    
      async barberServices(userId: string, dto: CreateBarberServiceDto, file?: Express.Multer.File) {
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        if (user.role !== status.BARBER) {
          throw new ForbiddenException('Only barbers can add services');
        }
    
    
        const barberService = await this.barberModel.create({
          user: user._id,
          description: dto.description,
          services: dto.services,
          workingHours: dto.workingHours,
          experience: dto.experience || 0,
    
        });
    
    
        if (file) {
          await this.hanleIMageUpload.handleImageUpload(userId, file)
        }
    
        return barberService;
      }
    
    
}