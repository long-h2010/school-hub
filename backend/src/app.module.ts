import { DatabaseModule } from './infrastructure/database/database.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { ChatModule } from './api/chat/chat.module';
import { CommentModule } from './api/comment/comment.module';
import { FollowingModule } from './api/following/following.module';
import { MessageModule } from './api/message/message.module';
import { PostModule } from './api/post/post.module';
import { UserModule } from './api/user/user.module';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';
import { SocketModule } from './infrastructure/socket/socket.module';
import { ReportModule } from './api/report/report.module';
import { GeminiModule } from './infrastructure/gemini/gemini.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    PostModule,
    ChatModule,
    CloudinaryModule,
    CommentModule,
    MessageModule,
    SocketModule,
    FollowingModule,
    ReportModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
