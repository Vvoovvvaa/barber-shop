import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { IJWTConfig } from '@app/common-barber';

import { AdminRepository } from './repositories/admin.repository';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { SecurityService } from './repositories/security.repository';
@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;

  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly securityService: SecurityService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get<IJWTConfig>('JWT_CONFIG')!;
  }

  async adminLogin(dto: CreateAuthDto) {
    const admin = await this.adminRepo.findByLogin(dto.login);

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    await this.securityService.checkBlocked(admin._id.toString());

    const isValid = await this.passwordService.compare(
      dto.password,
      admin.password,
    );

    if (!isValid) {
      await this.securityService.failedAttempt(admin._id.toString());
      throw new BadRequestException('invalid credentials');
    }

    await this.securityService.reset(admin._id.toString());

    const tempToken = this.tokenService.signAdmin(
      {
        sub: admin._id.toString(),
        login: admin.login,
        temp: true,
      },
      this.jwtConfig.admin,
    );

    return {
      tempToken,
      message: `successful login ${admin.login}`,
    };
  }

  async createAdmin(dto: CreateAuthDto, userId: string) {
    const creator = await this.adminRepo.findById(userId);

    if (!creator || !creator.superAdmin) {
      throw new ForbiddenException('Only superAdmin can create admins');
    }

    const hashedPassword = await this.passwordService.hash(dto.password);

    const admin = await this.adminRepo.create({
      login: dto.login,
      password: hashedPassword,
      superAdmin: false,
    });

    return {
      admin,
      message: `admin ${admin.login} successfully created`,
    };
  }
}