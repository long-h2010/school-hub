import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Following } from 'schemas/following.schema';

@Injectable()
export class FollowingService {
    constructor(
        @InjectModel(Following.name) private followingModel: Model<Following>,
    ) {}

    async getAmountFollow(userId: string) {
        const followers = await this.followingModel.countDocuments({ follower: userId });
        const following = await this.followingModel.countDocuments({ following: userId });

        return { followers, following };
    }
}
