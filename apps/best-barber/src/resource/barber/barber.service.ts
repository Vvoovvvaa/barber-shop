import { Injectable } from "@nestjs/common";

import { CreateBarberServiceDto } from "./dto/create-barber.dto";
import { UpdateBarberServiceDto } from "./dto/update-barber.dto";
import { changeStatusDto } from "./dto/change-status.dto";
import { changeStatusService } from "./services/change-status.service";
import { findBarberService } from "./services/find-barber.service";
import { handleImageUploadservice } from "./services/handle-Image-Upload.service";
import { removeService } from "./services/remove.service";
import { CreateBarberService } from "./services/create-barber-service.service";
import { UpdateBarberService } from "./services/update-service.service";


@Injectable()
export class BarberService {
  constructor(
    private readonly changeStatusService: changeStatusService,
    private readonly createBarberService: CreateBarberService,
    private readonly findBarberService: findBarberService,
    private readonly imageUpload: handleImageUploadservice,
    private readonly removeBarberService: removeService,
    private readonly updateBarberService: UpdateBarberService
  ) { }

  changeStatus(userId: string, dto: changeStatusDto) {
    return this.changeStatusService.changeStatus(userId, dto)
  }

  handleImageUpload(userId: string, file: Express.Multer.File) {
    return this.imageUpload.handleImageUpload(userId, file)
  }

  barberServices(userId: string, dto: CreateBarberServiceDto, file?: Express.Multer.File) {
    return this.createBarberService.barberServices(userId, dto, file)
  }

  findAllBarbers() {
    return this.findBarberService.findAllBarbers()
  }

  findOneBarber(userId: string) {
    return this.findBarberService.findOneBarber(userId)
  }

  updateService(userId: string, dto: UpdateBarberServiceDto, file?: Express.Multer.File) {
    return this.updateBarberService.updateService(userId, dto, file)
  }

  async removeService(userId: string) {
    return this.removeBarberService.removeService(userId)
  }

}