import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { status } from "@app/common-barber/database/enums";
import { Barber, User } from "@app/common-barber/database/schemas";
import { CreateBarberServiceDto } from "./dto/create-barber.dto";
import { UpdateBarberServiceDto } from "./dto/update-barber.dto";
import { v4 as uuid } from 'uuid'
import { S3Service } from "@app/common-barber/s3";
import { UserImage } from "@app/common-barber/database/schemas/s3-image";
import { SenderService } from "@app/common-barber/email/sender.service";


@Injectable()
export class BarberService {
  constructor(
    @InjectModel(Barber.name)
    private readonly barberModel: Model<Barber>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(UserImage.name)
    private readonly imageModel: Model<UserImage>,
    private readonly s3service: S3Service,
    private readonly senderservice: SenderService
  ) { }

  async changeStatus(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === status.CLIENT) {
      user.role = status.BARBER;
    }

    if (user.email) {
      await this.senderservice.sendEmail({
        to: user.email,
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        subject: 'role updated',
        template: 'role-change',
        context: {
          name: user.name || 'Пользователь',
          role: status.BARBER
        },
      });
    }

    Object.assign(user);

    return await user.save();
  }



  private async handleImageUpload(userId: string, file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${fileExtension}`;
    const filePath = `Vova/BarberShop/Barbers/${userId}/${fileName}`;

    await this.s3service.putObject(file.buffer, filePath, file.mimetype);

    return this.imageModel.findOneAndUpdate(
      { user: userId },
      { path: filePath, size: file.size },
      { upsert: true, new: true }
    );
  }

  async barberServices(userId: string, dto: CreateBarberServiceDto, file?: Express.Multer.File) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== status.BARBER) {
      throw new ForbiddenException('Only barbers can add services');
    }


    const barberService = await this.barberModel.create({
      user: user._id,
      description: dto.description,
      services: dto.services,
      workingHours: dto.workingHours,
      experience: dto.experience || 0,

    });


    if (file) {
      await this.handleImageUpload(userId, file)
    }

    return barberService;
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


  // async createService(userId: string, dto: CreateBarberServiceDto) {
  //   return this.barberModel.create({ user: userId, ...dto })
  // }


  async updateService(userId: string, dto: UpdateBarberServiceDto, file?: Express.Multer.File) {
    const service = await this.barberModel.findOne({ user: userId })

    if (!service) {
      throw new NotFoundException('service not found')
    }

    if (file) {
      await this.handleImageUpload(userId, file)
    }

    return this.barberModel.findOneAndUpdate({ _id: service._id }, dto, { new: true })
  }

  async removeService(userId: string) {
    const service = await this.barberModel.findOne({ user: userId })

    if (!service) {
      throw new NotFoundException('service not found')
    }

    await this.barberModel.findOneAndDelete({ _id: service._id })
    return { message: "Service succesful deleted" }
  }


}