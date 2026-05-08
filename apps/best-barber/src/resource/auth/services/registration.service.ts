import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { Auth, AuthSessionDocument, buildQuery, createRandomCode, IJWTConfig, SenderService, User, UserSecurity } from "@app/common-barber";
import { BarberOrClientDTO } from "../dto/create-auth.dto";

@Injectable()
export class Registrationservice {
    private jwtConfig: IJWTConfig;
    constructor(
        @InjectModel(Auth.name)
        private readonly authSessionModel: Model<AuthSessionDocument>,

        @InjectModel(UserSecurity.name)
        private readonly userSecurityModel: Model<UserSecurity>,

        @InjectModel(User.name)
        private readonly userModel: Model<User>,

        private readonly jwtService: JwtService,
        private readonly senderservice: SenderService,
        private readonly configService: ConfigService
    ) {
        this.jwtConfig = this.configService.get('JWT_CONFIG') as IJWTConfig;

    }


    async registration(dto: BarberOrClientDTO) {
        const query = buildQuery(dto.email, dto.phone);

        let user = await this.userModel.findOne(query);

        if (!user) {
            user = await this.userModel.create(query);
        }

        let security = await this.userSecurityModel.findOne({ user: user._id });

        if (!security) {
            security = await this.userSecurityModel.create({
                user: user._id,
                totalLoginAttempts: 0,
                temporaryBlocksCount: 0,
                permanentlyBlock: false,
                email: dto.email ?? null,
            });
        }

        if (security.permanentlyBlock) {
            throw new ForbiddenException('Your account has been permanently banned');
        }

        if (
            security.temporaryBlockUntil &&
            security.temporaryBlockUntil > new Date()
        ) {
            throw new ForbiddenException(
                `Account temporarily blocked until ${security.temporaryBlockUntil}`,
            );
        }

        const code = createRandomCode().toString();

        const sessionData: any = { code };

        if (dto.email) sessionData.email = dto.email;
        if (dto.phone) sessionData.phone = dto.phone;

        const session = new this.authSessionModel(sessionData);
        await session.save()
        console.log('CREATED USER', user)

        const tempToken = this.jwtService.sign(
            {
                sub: session._id.toString(),
                email: dto.email,
                phone: dto.phone,
                temp: true,
            },
            {
                secret: this.jwtConfig.tempSecret,
                expiresIn: '5m',
            },
        );

        if (user.email) {
            await this.senderservice.sendEmail({
                to: user.email,
                from: process.env.SMTP_FROM || 'no-reply@example.com',
                subject: "Code Message",
                template: "code-message",
                context: {
                    name: user.name || user.email || "User",
                    code: code
                }

            })
        }

        return {
            message: 'Verification code sent',
            tempToken,
            code,
        };
    }

}