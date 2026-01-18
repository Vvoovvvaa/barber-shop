import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, IJWTConfig } from '@app/common-barber';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;

  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
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

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

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

  async removeAdmin(userId: string, adminId: string) {
    const deleter = await this.adminModel.findById(userId).select('+superAdmin')
    const admin = await this.adminModel.findById(adminId)

    if (!admin) {
      throw new NotFoundException('admin not found')
    }

    if (!deleter || !deleter.superAdmin) {
      throw new ForbiddenException('only superAdmin can delete admins')
    }

    if (userId === adminId) {
      throw new ForbiddenException('SuperAdmin cannot delete themselves');
    }

    await this.adminModel.findByIdAndDelete(adminId)
    return {message:`admin ${admin.login} are succesful deleted by ${deleter.login}`}
  }



  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }


}
