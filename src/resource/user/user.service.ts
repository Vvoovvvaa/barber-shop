// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User, UserDocument } from '../schemas/user';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectModel(User.name)
//     private userModel: Model<UserDocument>,
//   ) {}

//   async create(data: Partial<User>) {
//     const user = new this.userModel(data);
//     return user.save();
//   }

//   async findAll() {
//     return this.userModel.find().exec();
//   }

//   async findByEmail(email: string) {
//     return this.userModel.findOne({ email }).exec();
//   }
// }
