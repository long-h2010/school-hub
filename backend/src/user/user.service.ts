import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'schemas/user.schema';
import { Model } from 'mongoose';
import { FollowingService } from 'src/following/following.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly followingService: FollowingService
    ) {}

    async create(createUserDto: CreateUserDto) {
        return await this.userModel.create(createUserDto);
    }

    async findAll() {
        return await this.userModel.find().exec();
    }

    async findOne(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async getProfile(id: string) {
        const user = await this.findOne(id);
        const following = await this.followingService.getAmountFollow(id);

        const res = { ...user.toObject(), ...following };
        return res;
    }

    async searchUser(userId: string, search: string) {
        const regex = RegExp(search, 'i');

        const query = {
            $or: [
                { name: { $regex: regex } },
                { email: { $regex: regex } }
            ],

            _id: { $ne: userId }
        };

        return await this.userModel.find(query).select('name avatar').limit(15).lean().exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return await `This action updates a #${id} user`;
    }

    async remove(id: string) {
        return await `This action removes a #${id} user`;
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email: email });
    }

    async findByStudentId(studentId: string) {
        return await this.userModel.findOne({ studentId: studentId }).select('+password');
    }
}

