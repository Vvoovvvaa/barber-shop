import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminSecurity } from '@app/common-barber';
import { Model } from 'mongoose';
import { AdminBlockService } from './services/admin-block.service';
import { BarberManagementService } from './services/barber-management.service';
import { UserManagementService } from './services/user-management.service';


@Injectable()
export class AdminsService {
  constructor(
    private readonly adminBlockService: AdminBlockService,
    private readonly userService: UserManagementService,
    private readonly barberService: BarberManagementService,
    @InjectModel(AdminSecurity.name)
    private readonly securityModel: Model<AdminSecurity>,
  ) { }

  async findAll() {
    const securityData = await this.securityModel.find().populate('admin');

    return securityData.map(sec => ({
      admin: sec.admin,
      temporaryBlockUntil: sec.temporaryBlockUntil,
      permanentlyBlock: sec.permanentlyBlock,
      totalLoginAttempts: sec.totalLoginAttempts,
      temporaryBlocksCount: sec.temporaryBlocksCount,
    }));
  }

  blockAdmin(adminId: string, superId: string) {
    return this.adminBlockService.block(adminId, superId);
  }

  unblockAdmin(adminId: string, superId: string) {
    return this.adminBlockService.unblock(adminId, superId);
  }

  deleteUser(userId: string) {
    return this.userService.deleteUser(userId);
  }

  unlockUser(userId: string) {
    return this.userService.unlockUser(userId);
  }

  deleteBarberService(serviceId: string) {
    return this.barberService.deleteService(serviceId);
  }

  deleteAdmin(adminId: string, deleterId: string) {
    return this.adminBlockService.removeAdmin(adminId, deleterId)
  }
}