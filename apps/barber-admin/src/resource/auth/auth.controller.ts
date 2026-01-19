import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
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

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @UseGuards(AdminAuthGuard)
  @Post('cancel/:id')
  cancleBlock(@Param('id' ) adminid: string, @AuthUser('id') id:string){
    return this.authService.blockCancel(adminid,id)
  }

  @UseGuards(AdminAuthGuard)
  @Post('block/:id')
  blockAdmin(@Param('id') adminid:string, @AuthUser('id') id:string){
    return this.authService.blockAdmin(adminid,id)
  }


  @UseGuards(AdminAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@AuthUser('id') userId: string,@Param('id') adminId:string) {
    return this.authService.removeAdmin(userId,adminId);
  }
}
