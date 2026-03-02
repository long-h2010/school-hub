import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatModule } from 'src/api/chat/chat.module';
import { MessageRepository } from './message.repository';

@Module({
  imports: [ChatModule],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
