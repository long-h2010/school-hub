import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/common/guard/auth-guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  @UseGuards(AuthGuard)
  async create(
    @Request() req: any,
    @Param('postId') postId: string,
    @Body() body: any,
  ) {
    const userId = req.user.id;
    const data: CreateCommentDto = {
      post: postId,
      owner: userId,
      content: body.content,
    };

    return await this.commentService.create(data);
  }

  @Get('post/:postId')
  @UseGuards(AuthGuard)
  async findAllInPost(@Param('postId') postId: string) {
    return this.commentService.findAllInPost(postId);
  }

  @Put('reply/:commentId')
  @UseGuards(AuthGuard)
  async reply(
    @Request() req: any,
    @Param('commentId') commentId: string,
    @Body() body: any,
  ) {
    const userId = req.user.id;
    const data: ReplyCommentDto = {
      user: userId,
      ...body,
    };

    return await this.commentService.reply(commentId, data);
  }
}
