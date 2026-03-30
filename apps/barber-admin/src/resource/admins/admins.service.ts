import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminSecurity, Appointment, Barber, User, userSecurity } from '@app/common-barber';
import { Model, Types } from 'mongoose';
import { TokenService } from '@app/redis';
import { NotFound } from '@aws-sdk/client-s3';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
    @InjectModel(AdminSecurity.name)
    private readonly securityModel: Model<AdminSecurity>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Barber.name)
    private readonly barberModel: Model<Barber>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
    @InjectModel(userSecurity.name)
    private readonly usersecurity: Model<userSecurity>,
    private readonly tokenservice: TokenService
  ) { }

  async findAll() {
    const securityData = await this.securityModel
      .find()
      .populate('admin')
      .exec();

    return securityData.map(sec => ({
      admin: sec.admin,
      temporaryBlockUntil: sec.temporaryBlockUntil,
      permanentlyBlock: sec.permanentlyBlock,
      totalLoginAttempts: sec.totalLoginAttempts,
      temporaryBlocksCount: sec.temporaryBlocksCount,
    }));
  }


  async removeAdmin(adminToDeleteId: string, deleterId: string) {
    const deleter = await this.adminModel
      .findById(deleterId)
      .select('+superAdmin');

    const admin = await this.adminModel.findById(adminToDeleteId);

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (!deleter || !deleter.superAdmin) {
      throw new ForbiddenException('Only superAdmin can delete admins');
    }

    if (deleterId === adminToDeleteId) {
      throw new ForbiddenException('SuperAdmin cannot delete themselves');
    }

    await this.adminModel.findByIdAndDelete(adminToDeleteId);

    return {
      message: `Admin ${admin.login} was successfully deleted by ${deleter.login}`,
    };
  }


  async blockCancel(admId: string, superadminId: string) {
    const admin = await this.adminModel.findById(admId);
    const superAdm = await this.adminModel.findById(superadminId).select('+superAdmin');

    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    if (!superAdm || !superAdm.superAdmin) {
      throw new ForbiddenException("Only super admin can change admins status");
    }

    const security = await this.securityModel.findOne({ admin: admin._id });
    if (!security) {
      throw new BadRequestException('Admin does not have security, try again later');
    }



    if (security.permanentlyBlock) {
      security.permanentlyBlock = false;
      security.temporaryBlocksCount = 0;
      security.totalLoginAttempts = 0;
      await security.save();
      return { message: `Admin ${admin.login} permanent block canceled` };
    }

    return { message: `Admin ${admin.login} did not have permanent block` };
  }



  async blockAdmin(adminId: string, superId: string) {
    const admin = await this.adminModel.findById(adminId)
    const superAdmin = await this.adminModel.findById(superId).select('+superAdmin')

    if (!admin) {
      throw new NotFoundException("admin not found")
    }

    if (!superAdmin || !superAdmin.superAdmin) {
      throw new ForbiddenException("only super admin can blocks admins")
    }

    const security3 = await this.securityModel.findOne({ admin: admin._id })

    if (!security3) {
      throw new BadRequestException('admin does have security')
    }

    if (security3.permanentlyBlock === false) {
      security3.permanentlyBlock = true,
        security3.temporaryBlocksCount = 0,
        security3.totalLoginAttempts = 0
      await security3.save()
      return { message: `Admin - ${admin.login} have permenent block ` }
    }
    return { message: `Admin - ${admin.login} already blocked` }
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId);
    const security = await this.usersecurity.findOne({ user: new Types.ObjectId(userId) });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (!security) {
      throw new NotFoundException('security not found');
    }

    user.isActivate = false;
    security.permanentlyBlock = true;
    await user.save();
    await security.save()

    await this.tokenservice.blockUser(userId);

    return { message: 'user deleted and tokens revoked' };
  }

  //////////////////////////////////////////////////////////////////////////
  async unlockesUser(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    user.isActivate = true;
    await user.save();

    await this.tokenservice.unblockUser(userId)

    return { message: 'The user has been successfully unblocked !' }
  }


  async deleteBarberService(serviceId: string) {
    const service = await this.barberModel.findById(serviceId);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.appointmentModel.deleteMany({
      service: String(service._id),
    });

    await this.barberModel.findByIdAndDelete(service._id);

    return { message: 'Service and related appointments deleted' };
  }
}
