import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateUsers } from './user.seed';
import { User } from 'src/entity-schemas/user.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async seedUsers() {
    console.log('🌱 Seeding users...');

    await this.userModel.deleteMany({}); 

    const users = generateUsers(1000);
    await this.userModel.insertMany(users);

    console.log('✅ Done seeding users');
  }
}
