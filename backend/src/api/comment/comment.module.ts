import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { PostModule } from 'src/api/post/post.module';
import { CommentRepository } from './comment.repository';

@Module({
  imports: [CloudinaryModule, PostModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
