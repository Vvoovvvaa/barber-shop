import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';
import { cloudconifd } from '../configs';
import { validationSchema } from '../validation';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    validationSchema: validationSchema,
    load: [cloudconifd],
  }),],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module { }

