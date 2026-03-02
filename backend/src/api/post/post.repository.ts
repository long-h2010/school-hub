import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base/base.repository';
import { Post } from 'src/entity-schemas/post.schema';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {
    super(postModel);
  }

  async getFeed(userId: string, stage: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const posts = await this.postModel.aggregate([
      { $match: stage },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { _id: 1, name: 1, avatar: 1 } }],
        },
      },
      { $unwind: '$author' },
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes', []] } },
          liked: {
            $in: [
              new mongoose.Types.ObjectId(userId),
              { $ifNull: ['$likes', []] },
            ],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await this.postModel.countDocuments();
    const hasMore = page * limit < total;
    const nextPage = hasMore ? +page + 1 : null;

    return { posts, nextPage, hasMore };
  }

  async updateLikes(postId: string, userId: string) {
    const post = await this.findOne({ _id: postId });
    return this.postModel.findByIdAndUpdate(postId, {
      likes: post.likes.includes(userId as any)
        ? post.likes.filter((id) => id.toString() !== userId)
        : [...post.likes, userId],
    });
  }

  async updateCommentCounting(postId: string) {
    const post = await this.findOne({ _id: postId });
    return this.postModel.findByIdAndUpdate(
      postId,
      {
        comments: post.comments + 1,
      },
      { new: true },
    );
  }
}
