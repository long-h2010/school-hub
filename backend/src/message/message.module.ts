import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatService } from 'src/chat/chat.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, ChatService],
})
export class MessageModule {}
