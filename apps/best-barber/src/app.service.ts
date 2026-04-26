import { status, User } from '@app/common-barber';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSecurity } from '@app/common-barber';
import { SenderService } from '@app/common-barber/email/sender.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(UserSecurity.name)
    private readonly userSecurityModel: Model<UserSecurity>,

    private readonly jwtService: JwtService,
    private readonly senderserice: SenderService
  ) {}

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('Google authentication failed');
    }

    const { email, name, googleId } = req.user;

    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }

    let user = await this.userModel.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
      }

      if (user.googleId && user.googleId !== googleId) {
        throw new ConflictException('Google account mismatch');
      }

      user.name = name || user.name;

      await user.save();
    } else {
      user = await this.userModel.create({
        email,
        name,
        googleId,
        role: status.CLIENT,
      });

      await this.userSecurityModel.create({
        user: user._id,
        email,
      });
    }

    if (user.email) {
        await this.senderserice.sendEmail({
          to: user.email, 
          from: process.env.SMTP_FROM || 'no-reply@example.com',
          subject: 'Добро пожаловать!',
          template: 'welcome-email',
          context: {
            name: user.name || 'User',
          },
        });
      }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      user,
      token,
    };
  }
}