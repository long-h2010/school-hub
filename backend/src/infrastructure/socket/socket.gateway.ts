import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/api/message/message.service';

@WebSocketGateway({
  cors: { origin: [process.env.WEB_URL] },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users = new Map<string, string>();

  constructor(private readonly msgService: MessageService) {}

  async handleConnection(client: Socket) {
    const userId = client.data.userId;
    this.users.set(userId, client.id);

    client.join(`user:${userId}`);
    client.emit('online-list', Array.from(this.users.keys()));
    this.server.emit('user-online', { userId });

    console.log(`User ${userId} connected`);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.users.delete(userId);

    client.leave(`user:${userId}`);
    this.server.emit('user-offline', { userId });

    console.log(`User ${userId} disconnected`);
  }

  @SubscribeMessage('join-all-chats')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody('chatIds') chatIds: string[],
  ) {
    chatIds.forEach((id) => client.join(`chat:${id}`));
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any,
  ) {
    const userId = client.data.userId;
    const sendMsgData = {
      sendTo: body.sendTo,
      message: body.message,
    };

    const message = await this.msgService.sendMessage(
      userId,
      body.chatId,
      sendMsgData,
    );

    this.server
      .to(`chat:${message.chat.toString()}`)
      .emit('new-message', message);
  }

  @SubscribeMessage('calling')
  async handleCalling(@MessageBody() body: any) {
    this.server
      .to(`user:${body.callee}`)
      .emit('ringing', { room: body.chatId, caller: body.caller });
  }

  @SubscribeMessage('accept-call')
  async handleAcceptCall(@MessageBody() body: any) {
    this.server.to(`user:${body.caller}`).emit('callee-accept');
  }
}
