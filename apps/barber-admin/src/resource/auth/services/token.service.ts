import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAdmin(payload: any, secret: string) {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '1d',
    });
  }
}