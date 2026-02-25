import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { MessageService } from 'src/message/message.service';
import { ChatService } from 'src/chat/chat.service';

@Module({
  providers: [SocketGateway, ChatService, MessageService],
})
export class SocketModule {}
