import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CommentModule } from './comment/comment.module';
import { MessageModule } from './message/message.module';
import { SocketModule } from './socket/socket.module';
import { FollowingModule } from './following/following.module';

@Module({
  imports: [
    DatabaseModule, 
    AuthModule, 
    UserModule, 
    PostModule, 
    ChatModule, 
    CloudinaryModule, CommentModule, MessageModule, SocketModule, FollowingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
