import { PartialType } from '@nestjs/mapped-types';
import {  CreateBarberServiceDto } from './create-barber.dto';

export class UpdateBarberServiceDto extends PartialType(CreateBarberServiceDto) {}
