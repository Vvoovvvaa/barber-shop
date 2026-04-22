import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { BarberOrClientDTO } from './dto/create-auth.dto';
import {
  Auth,
  AuthSessionDocument,
  User,
  UserSecurity,
} from '@app/common-barber/database/schemas';
import { createRandomCode } from '@app/common-barber';
import { IJWTConfig } from '@app/common-barber';
import { SenderService } from '@app/common-barber/email/sender.service';
import { buildQuery } from '@app/common-barber';

@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;

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

  // private buildQuery(email?: string, phone?: string) {
  //   if (email) return { email };
  //   if (phone) return { phone };
  //   throw new BadRequestException('Email or phone is required');
  // }

  async registration(dto: BarberOrClientDTO) {
    const query = buildQuery(dto.email, dto.phone);

    let user = await this.userModel.findOne(query);

    if (!user) {
      user = await this.userModel.create(query);
    }

    console.log("user email -", user.email)

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

    console.log("user ecurity -", security)

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
          code:code
        }

      })
    }

    return {
      message: 'Verification code sent',
      tempToken,
      code,
    };
  }

  async login(phone?: string, email?: string, code: string) {
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