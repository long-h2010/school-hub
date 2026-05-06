import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from 'src/common/guard/auth-guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Request() req: any,
    @UploadedFiles() images?: Express.Multer.File[],
    @Body() body?: any,
  ) {
    const userId = req.user.id;
    return await this.postService.create(userId, body.content, images);
  }

  @Get()
  async findAll(@Query() query) {
    return await this.postService.findAll(query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    const userId = req.user;
    return await this.postService.getFeed(userId, page, +limit);
  }

  @Get('author/:authorId')
  @UseGuards(AuthGuard)
  async getFeedByAuthor(
    @Request() req: any,
    @Param('authorId') authorId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    const userId = req.user;
    return await this.postService.getFeed(userId, page, +limit, authorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(id);
  }

  @Put('like/:postId')
  @UseGuards(AuthGuard)
  async updateLikeCounting(
    @Param('postId') postId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return await this.postService.updateLikes(postId, userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    return await this.postService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postService.remove(id);
  }
}
