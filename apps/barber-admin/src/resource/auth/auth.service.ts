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
      security = await this.securityModel.create({ admin: admin._id });
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
        security.temporaryBlockUntil = new Date(Date.now() + 60 * 60 * 1000);
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
      return { message: `admin ${admin.login} are succesful deleted by ${deleter.login}` }
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


  async blockAdmin(adminId:string,superId:string){
    const admin =  await this.adminModel.findById(adminId)
    const superAdmin = await this.adminModel.findById(superId).select('+superAdmin')

    if(!admin){
      throw new NotFoundException("admin not found")
    }

    if(!superAdmin || !superAdmin.superAdmin){
      throw new ForbiddenException("only super admin can blocks admins")
    }

    const security3 = await this.securityModel.findOne({admin: admin._id})

    if(!security3){
      throw new BadRequestException('admin does have security')
    }

    if(security3.permanentlyBlock === false){
      security3.permanentlyBlock = true,
      security3.temporaryBlocksCount = 0,
      security3.totalLoginAttempts = 0
      await security3.save()
      return {message:`Admin - ${admin.login} have permenent block `}
    }
    return {message:`Admin - ${admin.login} already blocked`}
  }


  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }


}
