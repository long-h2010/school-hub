import { Controller } from '@nestjs/common';
import { FollowingService } from './following.service';

@Controller('followings')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}
}
