import { Barber } from "@app/common-barber";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class removeService {
    constructor(
        @InjectModel(Barber.name)
        private readonly barberModel: Model<Barber>
    ) { }
    async removeService(userId: string) {
        const service = await this.barberModel.findOne({ user: userId })

        if (!service) {
            throw new NotFoundException('service not found')
        }

        await this.barberModel.findOneAndDelete({ _id: service._id })
        return { message: "Service succesful deleted" }
    }
}