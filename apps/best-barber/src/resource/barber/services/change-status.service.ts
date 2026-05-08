import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { changeStatusDto } from "../dto/change-status.dto";
import { status } from "@app/common-barber";
import { SenderService, User } from "@app/common-barber";

@Injectable()
export class changeStatusService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,

        private readonly senderService: SenderService

    ) { }

    async changeStatus(userId: string, dto: changeStatusDto) {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.email && !user.phone) {
            if (!dto.phone) {
                throw new BadRequestException(
                    'To become a barber, you have to add a phone number'
                );
            }

            user.phone = dto.phone;
        }

        if (dto.phone && user.phone !== dto.phone) {
            user.phone = dto.phone;
        }

        if (user.role === status.CLIENT) {
            user.role = status.BARBER;
        }

        if (user.email) {
            await this.senderService.sendEmail({
                to: user.email,
                from: process.env.SMTP_FROM || 'no-reply@example.com',
                subject: 'Role updated',
                template: 'role-change',
                context: {
                    name: user.name || user.email || 'User',
                    role: status.BARBER,
                },
            });
        }

        return await user.save();
    }
}