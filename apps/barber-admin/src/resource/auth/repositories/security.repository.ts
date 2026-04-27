import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminSecurity } from '@app/common-barber/database/schemas/admin-security';

@Injectable()
export class SecurityService {
  constructor(
    @InjectModel(AdminSecurity.name)
    private readonly securityModel: Model<AdminSecurity>,
  ) {}

  async getOrCreate(adminId: string) {
    let security = await this.securityModel.findOne({ admin: adminId });

    if (!security) {
      security = await this.securityModel.create({
        admin: adminId,
        totalLoginAttempts: 0,
        temporaryBlocksCount: 0,
      });
    }

    return security;
  }

  async checkBlocked(adminId: string) {
    const security = await this.getOrCreate(adminId);

    if (security.permanentlyBlock) {
      throw new ForbiddenException('Banned');
    }

    if (
      security.temporaryBlockUntil &&
      security.temporaryBlockUntil > new Date()
    ) {
      throw new ForbiddenException('Temporarily blocked');
    }

    return security;
  }

  async failedAttempt(adminId: string) {
    const security = await this.getOrCreate(adminId);

    security.totalLoginAttempts++;

    if (security.totalLoginAttempts >= 5) {
      security.temporaryBlockUntil = new Date(Date.now() + 15 * 60 * 1000);
      security.totalLoginAttempts = 0;
      security.temporaryBlocksCount++;
    }

    if (security.temporaryBlocksCount >= 3) {
      security.permanentlyBlock = true;
    }

    await security.save();
  }

  async reset(adminId: string) {
    const security = await this.getOrCreate(adminId);
    security.totalLoginAttempts = 0;
    await security.save();
  }
}