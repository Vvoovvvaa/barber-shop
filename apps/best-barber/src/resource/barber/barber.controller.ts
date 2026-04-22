import { UseGuards, Controller, Get, Param, Post, Body, Patch, Delete, UploadedFile, UseInterceptors } from "@nestjs/common"
import { AuthUser } from "@app/common-barber"
import { AuthGuard } from "@app/common-barber"
import { CreateBarberServiceDto } from "./dto/create-barber.dto"
import { UpdateBarberServiceDto } from "./dto/update-barber.dto"
import { BarberService } from "./barber.service"
import { IdDto } from "@app/common-barber/dto/parap-id.dto"
import { PhotoValidationPipe } from "@app/common-barber/validator"
import { FileInterceptor } from "@nestjs/platform-express"
import { Multer } from "multer"
import { EndOrderDTO } from "../appoitment/dto/end-order.dto"

@UseGuards(AuthGuard)
@Controller('barbers')
export class BarberController {
  constructor(private readonly barbersService: BarberService) { }

  @Post('change')
  async createBarber(@AuthUser('id') id: string) {
    return this.barbersService.changeStatus(id)
  }

  @Get()
  async getAllBarbers() {
    return this.barbersService.findAllBarbers()
  }

  @Get(':id')
  async findOneBarber(@Param() param: IdDto) {
    return this.barbersService.findOneBarber(param.id)
  }

  // @Post('service')
  // async createServices(@AuthUser('id') id: string, @Body() dto: CreateBarberServiceDto) {
  //   return this.barbersService.createService(id, dto)
  // }

  @UseInterceptors(FileInterceptor('photo'))
  @Patch('service')
  async updateService(@AuthUser('id') id: string, @Body() dto: UpdateBarberServiceDto,
    @UploadedFile(PhotoValidationPipe) file?: Express.Multer.File) {
    return this.barbersService.updateService(id, dto, file)
  }

  @Delete('service')
  async removeService(@AuthUser('id') id: string) {
    return this.barbersService.removeService(id)
  }

  @UseInterceptors(FileInterceptor('photo'))
  @Post('service')
  async createServices(@AuthUser('id') id: string, @Body() dto: CreateBarberServiceDto,
    @UploadedFile(PhotoValidationPipe) file?: Express.Multer.File) {
    return this.barbersService.barberServices(id, dto, file)
  }
}