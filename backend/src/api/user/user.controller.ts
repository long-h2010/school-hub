import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guard/auth-guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('overview')
  async overview() {
    return await this.userService.overview();
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return await this.userService.getProfile(id);
  }

  @Post('search')
  @UseGuards(AuthGuard)
  async searchUser(@Request() req: any, @Body('search') search: string) {
    const userId = req.user.id;
    return await this.userService.searchUser(userId, search);
  }

  @Patch('')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'coverPhoto', maxCount: 1 },
    ]),
  )
  async update(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      coverPhoto?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.id;
    return this.userService.updateWithImages(userId, updateUserDto, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
