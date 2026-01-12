import { UseGuards, Controller, Get, Param, Post, Body, Patch, Delete } from "@nestjs/common"
import { AuthUser } from "@app/common-barber"
import { AuthGuard } from "@app/common-barber"
import { CreateBarberServiceDto } from "./dto/create-barber.dto"
import { UpdateBarberServiceDto } from "./dto/update-barber.dto"
import { BarberService } from "./barber.service"
import { IdDto } from "@app/common-barber/dto/parap-id.dto"

@UseGuards(AuthGuard)
@Controller('barbers')
export class BarberController {
  constructor(private readonly barbersService: BarberService) { }

  @Post('create')
  async createBarber(@AuthUser('id') id:string){
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

  @Post('service')
  async createServices(@AuthUser('id') id: string, @Body() dto: CreateBarberServiceDto) {
    return this.barbersService.createService(id, dto)
  }

  @Patch('service')
  async updateService(@AuthUser('id') id: string, @Body() dto: UpdateBarberServiceDto) {
    return this.barbersService.updateService(id, dto)
  }

  @Delete('service')
  async removeService(@AuthUser('id') id: string) {
    return this.barbersService.removeService(id)
  }
}