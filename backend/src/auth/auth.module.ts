import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { FollowingService } from 'src/following/following.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRE,
        },
      }) as JwtModuleOptions
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, FollowingService],
  exports: [JwtModule]
})
export class AuthModule {}
