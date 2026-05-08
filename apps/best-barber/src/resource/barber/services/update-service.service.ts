import { Barber } from "@app/common-barber";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UpdateBarberServiceDto } from "../dto/update-barber.dto";
import { handleImageUploadservice } from "./handle-Image-Upload.service";

@Injectable()
export class UpdateBarberService {
    constructor(
        @InjectModel(Barber.name)
        private readonly barberModel: Model<Barber>,

        private readonly handleImageUpload: handleImageUploadservice
    ) { }

    async updateService(userId: string, dto: UpdateBarberServiceDto, file?: Express.Multer.File) {
        const service = await this.barberModel.findOne({ user: userId })

        if (!service) {
            throw new NotFoundException('service not found')
        }

        if (file) {
            await this.handleImageUpload.handleImageUpload(userId, file)
        }

        return this.barberModel.findOneAndUpdate({ _id: service._id }, dto, { new: true })
    }
}