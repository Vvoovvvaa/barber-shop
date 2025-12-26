import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { status } from "src/database/enums";
import { Barber, User} from "src/database/schemas";
import { CreateBarberServiceDto } from "./dto/create-barber.dto";
import { UpdateBarberServiceDto } from "./dto/update-barber.dto";

@Injectable()
export class BarberService {
  constructor(
    @InjectModel(Barber.name)
    private readonly barberModel: Model<Barber>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) { }

async createBarber(userId: string, dto: CreateBarberServiceDto) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.role === status.CLIENT) {
    user.role = status.BARBER;
  }

  Object.assign(user, dto);

  return await user.save();
}


  async findAllBarbers() {
    const services = await this.userModel.find()
    return services.filter(e => e.role === status.BARBER);
  }

  async findOneBarber(userId: string) {
    const barber = await this.userModel.findOne({
      _id: userId,
      role: status.BARBER,
    });

    if (!barber) {
      throw new NotFoundException('Barber not found');
    }

    return barber;
  }


  async createService(userId: string, dto: CreateBarberServiceDto) {
    return this.barberModel.create({ user: userId, ...dto })
  }


  async updateService(userId: string, dto: UpdateBarberServiceDto) {
    const service = await this.barberModel.findOne({ user: userId })

    if (!service) {
      throw new NotFoundException('service not found')
    }

    return this.barberModel.findOneAndUpdate({ _id: service._id }, dto, { new: true })
  }

  async removeService(userId: string) {
    const service = await this.barberModel.findOne({ user: userId })

    if (!service) {
      throw new NotFoundException('service not found')
    }

    return this.barberModel.findOneAndDelete({ _id: service._id })
  }

  async getOneServices(userId: string) {
    return this.barberModel.findOne({ user: userId }).populate('user')
  }

}