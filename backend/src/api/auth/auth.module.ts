import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserModule } from 'src/api/user/user.module';

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
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule]
})
export class AuthModule {}
