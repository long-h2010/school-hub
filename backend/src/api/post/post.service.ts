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

  async findAll(query: any) {
    return await this.postRepository.getList(query);
  }

  async findOne(id: string) {
    return await this.postRepository.findOne({ _id: id });
  }

  async update(id: string, data: any) {
    return await this.postRepository.update({ _id: id }, data);
  }

  async remove(id: string) {
    return this.postRepository.softDelete({ _id: id });
  }

  private readonly sortMap: Record<string, Record<string, 1 | -1>> = {
    new: { createdAt: -1 },
    hot: { likesCount: -1, createdAt: -1 },
    following: { createdAt: -1 },
    liked: { createdAt: -1 },
  };

  async getFeed(
    userId: string,
    page: number,
    limit: number,
    tab?: 'new' | 'hot' | 'following' | 'liked',
    authorId?: string,
  ) {
    const matchStage: any = { visibility: VisibilityType.PUBLIC };

    if (authorId) {
      matchStage.author = new mongoose.Types.ObjectId(authorId);
    }

    if (tab === 'liked') matchStage.likes = new mongoose.Types.ObjectId(userId);

    return await this.postRepository.getFeed(
      userId,
      matchStage,
      page,
      limit,
      this.sortMap[tab],
    );
  }

  async updateLikes(postId: string, userId: string) {
    return await this.postRepository.updateLikes(postId, userId);
  }

  async updateCommentCounting(postId: string) {
    return await this.postRepository.updateCommentCounting(postId);
  }
}
