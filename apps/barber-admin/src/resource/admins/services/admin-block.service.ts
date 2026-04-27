import { Admin, AdminSecurity } from "@app/common-barber";
import { NotFound } from "@aws-sdk/client-s3";
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class AdminBlockService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
    @InjectModel(AdminSecurity.name)
    private readonly securityModel: Model<AdminSecurity>,
  ) {}

  async block(adminId: string, superId: string) {
    const admin = await this.adminModel.findById(adminId);
    const superAdmin = await this.adminModel.findById(superId).select('+superAdmin');

    if (!admin) throw new NotFoundException('admin not found');
    if (!superAdmin?.superAdmin)
      throw new ForbiddenException('only super admin can block');

    const security = await this.securityModel.findOne({ admin: admin._id });

    if (!security) throw new BadRequestException('no security');

    security.permanentlyBlock = true;
    security.totalLoginAttempts = 0;
    security.temporaryBlocksCount = 0;

    await security.save();

    return { message: `Admin ${admin.login} blocked` };
  }

  async unblock(adminId: string, superId: string) {
    const security = await this.securityModel.findOne({ admin: adminId });

    if (!security) throw new NotFoundException('security not found');

    security.permanentlyBlock = false;
    security.totalLoginAttempts = 0;
    security.temporaryBlocksCount = 0;

    await security.save();
    return { message: `${security.admin} unblocked`}
  }
 
async removeAdmin(adminId: string, deleterId: string) {
  const admin = await this.adminModel.findById(adminId);

  if (!admin) {
    throw new NotFoundException('Admin not found');
  }

  const deleter = await this.adminModel
    .findById(deleterId)
    .select('+superAdmin');

  if (!deleter || !deleter.superAdmin) {
    throw new ForbiddenException('Only superAdmin can delete admins');
  }

  if (adminId === deleterId) {
    throw new ForbiddenException('You cannot delete yourself');
  }

  await this.securityModel.deleteOne({ admin: admin._id });

  await this.adminModel.findByIdAndDelete(admin._id);

  return {
    message: `Admin ${admin.login} deleted successfully by ${deleter.login}`,
  };
}
}

