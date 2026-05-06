import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowingService } from 'src/api/following/following.service';
import { UserRepository } from './user.repository';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly followingService: FollowingService,
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }

  async findAll(query: any) {
    const { search, searchFields, status, page, limit } = query;
    return await this.userRepository.getManyAdvanced({
      page: +page,
      limit: +limit,
      filter: {
        ...(status && { status }),
      },
      search: search
        ? {
            keyword: search,
            fields: searchFields?.split(',') ?? [],
          }
        : undefined,
    });
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

  async updateWithImages(
    id: string,
    updateUserDto: UpdateUserDto,
    files: {
      avatar?: Express.Multer.File[];
      coverPhoto?: Express.Multer.File[];
    },
  ) {
    const updateData: UpdateUserDto = { ...updateUserDto };

    if (files?.avatar?.[0]) {
      const uploaded = await this.cloudinaryService.saveImage(
        files.avatar,
        'photo',
      );
      updateData.avatar = uploaded[0];
    }

    if (files?.coverPhoto?.[0]) {
      const uploaded = await this.cloudinaryService.saveImage(
        files.coverPhoto,
        'photo',
      );
      updateData.coverPhoto = uploaded[0];
    }

    return await this.userRepository.update({ _id: id }, updateData);
  }

  async remove(id: string) {
    return await this.userRepository.remove({ id });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ email: email });
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne(
      { username: username },
      '+password',
      false,
    );
  }

  async overview() {
    return await this.userRepository.overview();
  }

  async findByEmailToResetPassword(email: string) {
    return await this.userRepository.findOne(
      { email: email },
      '+otp +otpExpiry',
    );
  }

  async update(id, data: any) {
    return await this.userRepository.update({ _id: id }, data);
  }
}
