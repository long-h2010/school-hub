import { Injectable } from '@nestjs/common';
import { FollowingRepository } from './following.repository';

@Injectable()
export class FollowingService {
  constructor(
    private readonly followingRepository: FollowingRepository,
  ) {}

  async countFollowing(userId: string) {
    return this.followingRepository.countFollowing(userId);
  }
}
