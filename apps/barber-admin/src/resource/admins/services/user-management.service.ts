import { User, UserSecurity } from "@app/common-barber";
import { TokenService } from "@app/redis";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@Injectable()
export class UserManagementService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(UserSecurity.name)
    private readonly securityModel: Model<UserSecurity>,
    private readonly tokenService: TokenService,
  ) {}

  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId);
    const security = await this.securityModel.findOne({
      user: new Types.ObjectId(userId),
    });

    if (!user) throw new NotFoundException('user not found');
    if (!security) throw new NotFoundException('security not found');

    user.isActivate = false;
    security.permanentlyBlock = true;

    await user.save();
    await security.save();

    await this.tokenService.blockUser(userId);

    return { message: 'user blocked' };
  }

  async unlockUser(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundException('user not found');

    user.isActivate = true;
    await user.save();

    await this.tokenService.unblockUser(userId);

    return { message: 'user unblocked' };
  }
}