import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { FollowingModule } from 'src/api/following/following.module';

@Module({
  imports: [FollowingModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}
