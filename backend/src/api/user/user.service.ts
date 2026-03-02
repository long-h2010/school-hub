import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowingService } from 'src/api/following/following.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly followingService: FollowingService,
    private readonly userRepository: UserRepository
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ _id: id });
  }

  async getProfile(id: string) {
    const user = await this.findOne(id);
    const following = await this.followingService.countFollowing(id);

    const res = { ...user.toObject(), ...following };
    return res;
  }

  async searchUser(userId: string, search: string) {
    const regex = RegExp(search, 'i');

    const query = {
      $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
      _id: { $ne: userId },
    };

    return await this.userRepository.findMany({ filter: query });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update({ id }, updateUserDto);
  }

  async remove(id: string) {
    return await  this.userRepository.remove({ id });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ email: email });
  }

  async findByStudentId(studentId: string) {
    return await this.userRepository.findOne({ studentId: studentId }, '+password');
  }
}
