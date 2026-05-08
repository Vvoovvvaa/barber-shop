import {Injectable} from '@nestjs/common';


import { BarberOrClientDTO } from './dto/create-auth.dto';
import { Registrationservice } from './services/registration.service';
import { LoginSerice } from './services/login.service';
import { ViewAllUsers } from './services/all-user.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly registrationService: Registrationservice,
    private readonly loginService: LoginSerice,
    private readonly allUSerService: ViewAllUsers
  ) { }

  registration(dto: BarberOrClientDTO) {
    return this.registrationService.registration(dto)
  }

  login(phone?: string, email?: string, code?: string) {
    return this.loginService.login(phone, email, code)
  }


  allUSer() {
    return this.allUSerService.allUSer()
  }
}