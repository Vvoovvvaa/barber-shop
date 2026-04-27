import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { AdminsService } from './admins.service';
import { AuthUser, IdDto } from '@app/common-barber';
import { AdminAuthGuard } from '@app/common-barber/guard/admin-guard';
@UseGuards(AdminAuthGuard)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Patch(':id/block')
  blockAdmin(
    @Param('id') adminId: string,
    @AuthUser('id') superId: string,
  ) {
    return this.adminsService.blockAdmin(adminId, superId);
  }

  @Patch(':id/unblock')
  cancelBlock(
    @Param('id') adminId: string,
    @AuthUser('id') superId: string,
  ) {
    return this.adminsService.unblockAdmin(adminId, superId);
  }

  @Delete(':id')
  removeAdmin(
    @Param('id') adminId: string,
    @AuthUser('id') deleterId: string,
  ) {
    return this.adminsService.deleteAdmin(adminId, deleterId);
  }

  @Delete('users/:id')
  removeUser(@Param('id') userId: string) {
    return this.adminsService.deleteUser(userId);
  }

  @Delete('services/:id')
  deleteService(@Param('id') serviceId: string) {
    return this.adminsService.deleteBarberService(serviceId);
  }
}