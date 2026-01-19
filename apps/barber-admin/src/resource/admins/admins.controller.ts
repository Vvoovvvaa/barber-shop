import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { AdminsService } from './admins.service';
import { AuthUser } from '@app/common-barber';
import { AdminAuthGuard } from '@app/common-barber/guard/admin-guard';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @UseGuards(AdminAuthGuard)
  @Post('cancel/:id')
  cancleBlock(@Param('id' ) adminid: string, @AuthUser('id') id:string){
    return this.adminsService.blockCancel(adminid,id)
  }

  @UseGuards(AdminAuthGuard)
  @Post('block/:id')
  blockAdmin(@Param('id') adminid:string, @AuthUser('id') id:string){
    return this.adminsService.blockAdmin(adminid,id)
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@AuthUser('id') userId: string,@Param('id') adminId:string) {
    return this.adminsService.removeAdmin(userId,adminId);
  }
}
