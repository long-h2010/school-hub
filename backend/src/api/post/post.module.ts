import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { PostRepository } from './post.repository';

@Module({
  imports: [CloudinaryModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
