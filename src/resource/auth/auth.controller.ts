import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BarberOrClientDTO } from './dto/create-auth.dto';
import { AuthGuard } from 'src/guard';
import { VerifyCodeDto } from './dto/code-dto';
import { AuthUser } from 'src/decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async sendCode(@Body() dto: BarberOrClientDTO) {
    return this.authService.registration(dto);
  }

  @UseGuards(AuthGuard)
  @Post('login')
  async verifyCode(@Body() dto: VerifyCodeDto, @AuthUser('phone') phone: string) {
    return this.authService.login(phone, dto.code);
  }
}