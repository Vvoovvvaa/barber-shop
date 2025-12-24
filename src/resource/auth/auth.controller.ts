import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BarberOrClientDTO } from './dto/create-auth.dto';
import { AuthGuard } from 'src/guard';
import { VerifyCodeDto } from './dto/code-dto';
import { AuthUser } from 'src/decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  async sendCode(@Body() dto: BarberOrClientDTO) {
    return this.authService.sendCode(dto);
  }

  @UseGuards(AuthGuard)
  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyCodeDto, @AuthUser('phone') phone: string) {
    return this.authService.verifyCode(phone, dto.code);
  }
}