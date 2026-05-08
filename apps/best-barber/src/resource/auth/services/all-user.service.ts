import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User } from "@app/common-barber";

@Injectable()
export class ViewAllUsers {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) { }

    async allUSer() {
        return this.userModel.find()
    }
}