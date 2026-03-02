import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { FollowingRepository } from './following.repository';

@Module({
  controllers: [FollowingController],
  providers: [FollowingService, FollowingRepository],
  exports: [FollowingService],
})
export class FollowingModule {}
