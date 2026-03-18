import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, IJWTConfig } from '@app/common-barber';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminSecurity } from '@app/common-barber/database/schemas/admin-security';

@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;

  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
    @InjectModel(AdminSecurity.name)
    private readonly securityModel: Model<AdminSecurity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtConfig = this.configService.get<IJWTConfig>('JWT_CONFIG')!;
  }

  async adminLogin(dto: CreateAuthDto) {
    const admin = await this.adminModel
      .findOne({ login: dto.login })
      .select('+password');

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    let security = await this.securityModel.findOne({ admin: admin._id });
    if (!security) {
      security = await this.securityModel.create({
        admin: admin._id,
        totalLoginAttempts: 0,
        temporaryBlocksCount: 0,
      });
    }

    if (security.permanentlyBlock === true) {
      throw new ForbiddenException('Your account have banned for a long time')
    }

    if (security.temporaryBlockUntil && security.temporaryBlockUntil > new Date()) {
      throw new ForbiddenException(`Account temporarily blocked until ${security.temporaryBlockUntil}`);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);

    if (!isPasswordValid) {
      security.totalLoginAttempts += 1
      if (security.totalLoginAttempts >= 5) {
        security.temporaryBlockUntil = new Date(Date.now() + 10  * 15 * 1000);
        security.totalLoginAttempts = 0;
        security.temporaryBlocksCount += 1;
      }

      if (security.temporaryBlocksCount >= 3) {
        security.permanentlyBlock = true
      }

      await security.save()
      throw new BadRequestException('invalid credentials')
    }

    security.totalLoginAttempts = 0
    await security.save()


    const tempToken = this.jwtService.sign(
      {
        sub: admin._id.toString(),
        login: admin.login,
        temp: true,
      },
      {
        secret: this.jwtConfig.admin,
        expiresIn: '1d',
      },
    );

    return { tempToken, message: `succeful login ${admin.login}` };
  }

  async createAdmin(dto: CreateAuthDto, userId: string) {
    const creator = await this.adminModel
      .findById(userId)
      .select('+superAdmin')

    if (!creator || !creator.superAdmin) {
      throw new ForbiddenException('Only superAdmin can create admins')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = await this.adminModel.create({
      login: dto.login,
      password: hashedPassword,
      superAdmin: false,
    });

    return { admin, message: `admin ${admin.login} are succesful created` };
  }

}
