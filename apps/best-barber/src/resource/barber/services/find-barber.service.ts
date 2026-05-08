import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { status } from "@app/common-barber";
import { User } from "@app/common-barber";

@Injectable()
export class findBarberService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel:Model<User>,

    ) { }


    async findAllBarbers() {
        const services = await this.userModel.find()
        return services.filter(e => e.role === status.BARBER);
    }

    async findOneBarber(userId: string) {
        const barber = await this.userModel.findOne({
            _id: userId,
            role: status.BARBER,
        });

        if (!barber) {
            throw new NotFoundException('Barber not found');
        }

        return barber;
    }


}