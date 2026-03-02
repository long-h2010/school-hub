import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import VisibilityType from 'src/common/enums/visibility.enum';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly cloudService: CloudinaryService,
  ) {}

  async create(userId: string, content: string, images: Express.Multer.File[]) {
    let imgs = [];
    if (images?.length > 0) {
      imgs = await this.cloudService.saveImage(images, 'posts');
    }

    const data: CreatePostDto = {
      author: userId,
      content: content,
      images: imgs,
    };

    return await this.postRepository.create(data);
  }

  async findAll() {
    return await this.postRepository.findAll();
  }

  async findOne(id: string) {
    return await this.postRepository.findOne({ _id: id });
  }

  async update(id: string) {
    return `This action updates a #${id} post`;
  }

  async remove(id: string) {
    return `This action removes a #${id} post`;
  }

  async getFeed(
    userId: string,
    page: number,
    limit: number,
    authorId?: string,
  ) {
    const matchStage: any = { visibility: VisibilityType.public };

    if (authorId) matchStage.author = new mongoose.Types.ObjectId(authorId);

    return await this.postRepository.getFeed(userId, matchStage, page, limit);
  }

  async updateLikes(postId: string, userId: string) {
    return await this.postRepository.updateLikes(postId, userId);
  }

  async updateCommentCounting(postId: string) {
    return await this.postRepository.updateCommentCounting(postId);
  }
}
