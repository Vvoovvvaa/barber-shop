import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuid } from 'uuid'

import { S3Service, UserImage } from "@app/common-barber";

@Injectable()
export class handleImageUploadservice {
    constructor(
        @InjectModel(UserImage.name)
        private readonly imageModel: Model<UserImage>,

        private readonly s3service: S3Service,

    ) { }

    async handleImageUpload(userId: string, file: Express.Multer.File) {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuid()}.${fileExtension}`;
        const filePath = `Vova/BarberShop/Barbers/${userId}/${fileName}`;

        await this.s3service.putObject(file.buffer, filePath, file.mimetype);

        return this.imageModel.findOneAndUpdate(
            { user: userId },
            { path: filePath, size: file.size },
            { upsert: true, new: true }
        );
    }
}