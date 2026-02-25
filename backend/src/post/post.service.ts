import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post } from 'schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import VisibilityType from 'enums/visibility.enum';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        private readonly cloudService: CloudinaryService
    ) {}

    async create(userId: string, content: string, images: Express.Multer.File[]) {
        let imgs = []
        if (images?.length > 0) {
            imgs = await this.cloudService.saveImage(images, 'posts');
        }

        const data: CreatePostDto = {
            author: userId,
            content: content,
            images: imgs
        };

        return await this.postModel.create(data);
    }

    async findAll() {
        return await this.postModel.find().exec();
    }

    async findOne(id: string) {
        const post = await this.postModel.findById(id);
        if (!post) throw new NotFoundException('Post not found');
        return post;
    }

    async update(id: string) {
        return `This action updates a #${id} user`;
    }

    async remove(id: string) {
        return `This action removes a #${id} user`;
    }

    async getFeed(userId: string, page: number, limit: number, authorId?: string) {
        const skip = (page - 1) * limit;
        const matchStage: any = { visibility: VisibilityType.public };

        if (authorId) matchStage.author = new mongoose.Types.ObjectId(authorId);

        const posts = await this.postModel.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                    pipeline: [
                        { $project: { _id: 1, name: 1, avatar: 1 } }
                    ]
                }
            },
            { $unwind: '$author' },
            {
                $addFields: {
                    likesCount: { $size: { $ifNull: ['$likes', []] } },
                    liked: { $in: [new mongoose.Types.ObjectId(userId), { $ifNull: ['$likes', []] }] }
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        const total = await this.postModel.countDocuments();
        const hasMore = page * limit < total;
        const nextPage = hasMore ? +page + 1 : null;

        return { posts, nextPage, hasMore };
    }

    async updateLikes(postId: string, userId: string) {
        const post = await this.findOne(postId);
        return this.postModel.findByIdAndUpdate(postId, {
            likes: post.likes.includes(userId as any)
                ? post.likes.filter(id => id.toString() !== userId)
                : [...post.likes, userId],
        });
    }

    async updateCommentCounting(postId: string) {
        const post = await this.findOne(postId);
        return this.postModel.findByIdAndUpdate(postId, {
            comments: post.comments + 1,
        }, { new: true });
    }
}
