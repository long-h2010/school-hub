import { Injectable } from '@nestjs/common';
import { ChatService } from 'src/api/chat/chat.service';
import SendMessageDto from './dto/send-message.dto';
import CreateMessageDto from './dto/create-message.dto';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly msgRepository: MessageRepository,
    private readonly chatService: ChatService,
  ) {}

  async sendMessage(userId: string, chatId: string, data: SendMessageDto) {
    let chat: any;

    if (!chatId) {
      chat = await this.chatService.create({
        members: [{ user: userId, isAccepted: true }, { user: data.sendTo }],
      });
    } else {
      chat = await this.chatService.findOne(userId, chatId);
    }

    const chatRoom = chat._id.toString();

    const msgData: CreateMessageDto = {
      chat: chatRoom,
      sender: userId,
      message: data.message,
      readed: [userId],
    };

    const message = await this.msgRepository.sendMessage(msgData);
    await this.chatService.updateLastMessage(chatRoom, message._id.toString());

    return message;
  }

  async findMessageByChat(chatId: string) {
    return await this.msgRepository.findMessageByChat(chatId);
  }

  async maskAsRead(userId: string, chatId: string) {
    return await this.msgRepository.maskAsRead(userId, chatId);
  }
}
