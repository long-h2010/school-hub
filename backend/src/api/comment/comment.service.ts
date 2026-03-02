import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/entity-schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostService } from 'src/api/post/post.service';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postService: PostService,
  ) {}

  async create(data: CreateCommentDto) {
    const comment = await this.commentRepository.create(data);
    await this.postService.updateCommentCounting(data.post);
    return comment;
  }

  async findAll() {
    return await this.commentRepository.findAll();
  }

  async findOne(id: string) {
    const comment = await this.commentRepository.findOne({ _id: id });
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
    return await this.commentRepository.findMany({
      filter: { post: postId },
      sort: { createdAt: -1 },
    });
  }

  async reply(commentId: string, data: ReplyCommentDto) {
    const comment = await this.commentRepository.reply(commentId, data);
    await this.postService.updateCommentCounting(comment.post.toString());
    return { message: 'Reply comment successfully' };
  }
}
