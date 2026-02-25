import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FollowingService } from 'src/following/following.service';

@Module({
  controllers: [UserController],
  providers: [UserService, FollowingService],
})
export class UserModule {}
