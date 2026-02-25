import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostService } from 'src/post/post.service';
import { ReplyCommentDto } from './dto/reply-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        private readonly postService: PostService
    ) {}

    async create(data: CreateCommentDto) {
        const comment = await this.commentModel.create(data);
        await this.postService.updateCommentCounting(data.post);
        return comment;
    }

    async findAll() {
        return await this.commentModel.find().exec();
    }

    async findOne(id: string) {
        const comment = await this.commentModel.findById(id);
        if (!comment) throw new NotFoundException('Comment not found');
        return comment;
    }

    async update(id: string) {
        return await `This action updates a #${id} comment`;
    }

    async remove(id: string) {
        return await `This action removes a #${id} comment`;
    }

    async findAllInPost(postId: string) {
        return await this.commentModel.find({ post: postId }).sort({ createdAt: -1 });
    }

    async reply(commentId: string, data: ReplyCommentDto) {
        const comment = await this.findOne(commentId);
        comment.replies.push(data);

        await this.postService.updateCommentCounting(comment.post.toString());
        comment.replyCounting += 1;

        await comment.save();
        return comment;
    }
}
