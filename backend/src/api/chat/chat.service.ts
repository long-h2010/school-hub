import { ForbiddenException, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  validateParticipant(user: string, members: Record<string, any>[]) {
    const participants = members.map((p) => p.user.toString());
    if (!participants.includes(user))
      throw new ForbiddenException('You are not a participant of this chat');
  }

  async create(data: CreateChatDto) {
    const membersLength = data.members.length;
    const userIds = data.members.map((m) => m.user);

    if (membersLength == 2) {
      const chat = await this.chatRepository.findOne(
        {
          'members.user': { $all: userIds },
          'members.2': { $exists: false },
        },
        '',
        false,
      );

      if (chat) return chat;
    }

    return await this.chatRepository.create(data);
  }

  async findOne(userId: string, chatId: string) {
    const chat = await this.chatRepository.findOne({ _id: chatId });
    if (chat) this.validateParticipant(userId, chat.members);
    return chat;
  }

  async findAllByUserId(userId: string) {
    const objId = new mongoose.Types.ObjectId(userId);
    return await this.chatRepository.findAllByUserId(objId);
  }

  async updateLastMessage(chatId: string, messageId: string) {
    return await this.chatRepository.update(
      { _id: chatId },
      { lastMessage: messageId },
    );
  }

  async acceptChat(chatId: string, userId: string) {
    const chat = await this.chatRepository.acceptChat(chatId, userId);

    if (!chat)
      throw new ForbiddenException('You are not a participant of this chat');

    return { message: 'Chat accepted' };
  }
}
