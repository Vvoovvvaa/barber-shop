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
import { Auth, AuthSessionDocument, User } from '@app/common-barber/database/schemas';
import { createRandomCode } from '@app/common-barber';
import { IJWTConfig } from '@app/common-barber';
import { userSecurity } from '@app/common-barber/database/schemas/user-security';

@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;

  constructor(
    @InjectModel(Auth.name)
    private readonly authSessionModel: Model<AuthSessionDocument>,

    @InjectModel(userSecurity.name)
    private readonly userSecurityModel: Model<userSecurity>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get('JWT_CONFIG') as IJWTConfig;
  }

  async registration(dto: BarberOrClientDTO) {
    let user = await this.userModel.findOne({ phone: dto.phone });

    if (!user) {
      user = await this.userModel.create({
        phone: dto.phone,
      });
    }

    let security = await this.userSecurityModel.findOne({ user: user._id });

    if (!security) {
      security = await this.userSecurityModel.create({
        user: user._id,
        totalLoginAttempts: 0,
        temporaryBlocksCount: 0,
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

    const session = await this.authSessionModel.create({
      phone: dto.phone,
      code,
    });

    const tempToken = this.jwtService.sign(
      {
        sub: session._id.toString(),
        phone: dto.phone,
        temp: true,
      },
      {
        secret: this.jwtConfig.tempSecret,
        expiresIn: '5m',
      },
    );

    return {
      message: 'Verification code sent',
      tempToken,
      code,
    };
  }

  async login(phone: string, code: string) {
    const session = await this.authSessionModel
      .findOne({ phone })
      .sort({ createdAt: -1 });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    const user = await this.userModel.findOne({ phone });

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

    await this.authSessionModel.deleteMany({ phone });

    const token = this.jwtService.sign(
      {
        sub: user._id.toString(),
        phone: user.phone,
        role: user.role,
      },
      {
        secret: this.jwtConfig.secret,
        expiresIn: this.jwtConfig.expiresIn,
      },
    );

    return { token, message: `User ${user.phone} succesful login` };
  }
}