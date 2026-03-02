import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ChatModule } from 'src/api/chat/chat.module';
import { MessageModule } from 'src/api/message/message.module';

@Module({
  imports: [ChatModule, MessageModule],
  providers: [SocketGateway],
})
export class SocketModule {}
