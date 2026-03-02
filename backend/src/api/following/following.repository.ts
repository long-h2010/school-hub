import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base/base.repository';
import { Following } from 'src/entity-schemas/following.schema';

@Injectable()
export class FollowingRepository extends BaseRepository<Following> {
  constructor(@InjectModel(Following.name) private readonly followingModel: Model<Following>) {
    super(followingModel);
  }

  async countFollowing(userId: string) {
    const followers = await this.followingModel.countDocuments({
      follower: userId,
    });
    const following = await this.followingModel.countDocuments({
      following: userId,
    });

    return { followers, following };
  }
}
