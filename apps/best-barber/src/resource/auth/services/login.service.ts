import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Auth, AuthSessionDocument, buildQuery, IJWTConfig, SenderService, User, UserSecurity } from "@app/common-barber";

@Injectable()
export class LoginSerice {
    private jwtConfig: IJWTConfig
    constructor(
        @InjectModel(Auth.name)
        private readonly authSessionModel: Model<AuthSessionDocument>,

        @InjectModel(UserSecurity.name)
        private readonly userSecurityModel: Model<UserSecurity>,

        @InjectModel(User.name)
        private readonly userModel: Model<User>,

        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,

        private readonly senderservice: SenderService,
    ) {
        this.jwtConfig = this.configService.get('JWT_CONFIG') as IJWTConfig;

    }

    async login(phone?: string, email?: string, code?: string) {
        const query = buildQuery(email, phone);

        const session = await this.authSessionModel
            .findOne({
                ...query,
                code,
            })
            .sort({ createdAt: -1 });

        if (!session || session.expiresAt < new Date()) {
            throw new UnauthorizedException('Invalid or expired code');
        }

        const user = await this.userModel.findOne(query);
        console.log("login user -", user)

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const security = await this.userSecurityModel.findOne({ user: user._id });

        if (!security) {
            throw new BadRequestException('User security not found');
        }

        if (security.permanentlyBlock) {
            throw new ForbiddenException('Your account is permanently blocked');
        }

        if (
            security.temporaryBlockUntil &&
            security.temporaryBlockUntil > new Date()
        ) {
            throw new ForbiddenException(
                `Account temporarily blocked until ${security.temporaryBlockUntil}`,
            );
        }

        if (String(session.code) !== String(code)) {
            security.totalLoginAttempts += 1;

            if (security.totalLoginAttempts >= 5) {
                security.temporaryBlocksCount += 1;
                security.totalLoginAttempts = 0;

                if (security.temporaryBlocksCount >= 3) {
                    security.permanentlyBlock = true;
                } else {
                    const blockUntil = new Date();
                    blockUntil.setMinutes(blockUntil.getMinutes() + 1);
                    security.temporaryBlockUntil = blockUntil;
                }
            }

            await security.save();
            throw new UnauthorizedException('Invalid verification code');
        }

        security.totalLoginAttempts = 0;
        security.temporaryBlockUntil = undefined;
        security.temporaryBlocksCount = 0;
        await security.save();

        await this.authSessionModel.deleteMany(query);

        const token = this.jwtService.sign(
            {
                sub: user._id.toString(),
                phone: user.phone,
                email: user.email,
                role: user.role,
            },
            {
                secret: this.jwtConfig.secret,
                expiresIn: this.jwtConfig.expiresIn,
            },
        );

        if (user.email) {
            await this.senderservice.sendEmail({
                to: user.email,
                from: process.env.SMTP_FROM || 'no-reply@example.com',
                subject: 'welcome message!',
                template: 'welcome-email',
                context: {
                    name: user.name || user.email || 'User',
                },
            });
        }
        return {
            token,
            message: `User ${user.name || user.phone || user.email} successful login`,
        };
    }


}