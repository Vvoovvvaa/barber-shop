import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AdminAuthGuard } from '@app/common-barber/guard/admin-guard';
import { AuthUser } from '@app/common-barber';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.adminLogin(createAuthDto);
  }

  @UseGuards(AdminAuthGuard)
  @Post('create')
  createAdmin(@Body() createAuthDto: CreateAuthDto,@AuthUser('id') userId:string) {
    return this.authService.createAdmin(createAuthDto,userId);
  }




}
