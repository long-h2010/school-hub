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

  async getFeed(
    userId: string,
    stage: any,
    page: number,
    limit: number,
    sort: Record<string, 1 | -1> = { createdAt: -1 },
  ) {
    const skip = (page - 1) * limit;

    const posts = await this.postModel.aggregate([
      { $match: { ...stage, deletedAt: null } },
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
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await this.postModel.countDocuments({
      ...stage,
      deletedAt: null,
    });
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

  async getList(query: any) {
    return await this.getManyAdvanced({
      filter: {
        ...(query.reason && { reason: query.reason }),
        ...(query.status && { status: query.status }),
      },

      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,

      relations: [
        {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
          project: {
            _id: 1,
            name: 1,
            avatar: 1,
          },
        },
      ],
    });
  }

  async overview() {
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();

    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = lastMonthDate.getMonth() + 1;
    const lastYear = lastMonthDate.getFullYear();

    const [total, monthly] = await Promise.all([
      this.postModel.countDocuments(),
      this.postModel.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
    ]);

    const thisMonthCount =
      monthly.find((m) => m._id.month === thisMonth && m._id.year === thisYear)
        ?.count ?? 0;

    const lastMonthCount =
      monthly.find((m) => m._id.month === lastMonth && m._id.year === lastYear)
        ?.count ?? 0;

    const growthPercent =
      lastMonthCount === 0
        ? 100
        : ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;

    return { total, growthPercent, monthly };
  }

  async countDocuments(userId: string) {
    return this.postModel.countDocuments({ author: userId })
  }
}
