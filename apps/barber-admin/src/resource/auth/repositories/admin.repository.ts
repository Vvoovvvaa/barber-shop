import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '@app/common-barber';

@Injectable()
export class AdminRepository {
    constructor(
        @InjectModel(Admin.name)
        private readonly adminModel: Model<Admin>,
    ) { }

    findByLogin(login: string) {
        return this.adminModel.findOne({ login }).select('+password');
    }

    findById(id: string) {
        return this.adminModel.findById(id).select('+superAdmin');
    }

    async create(data: Partial<Admin>): Promise<Admin> {
        return await this.adminModel.create(data);
    }
}