import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base/base.repository';
import { Message } from 'src/entity-schemas/message.schema';

@Injectable()
export class MessageRepository extends BaseRepository<Message> {
  constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>) {
    super(messageModel);
  }

  async sendMessage(data: any) {
    const message = await this.messageModel.create(data);
    return message.populate('sender', 'name avatar');
  }

  async findMessageByChat(chatId: string) {
    return await this.messageModel
      .find({ chat: chatId })
      .populate('sender', 'name avatar');
  }

  async maskAsRead(userId: string, chatId: string) {
    return await this.messageModel.updateMany(
      {
        chat: chatId,
        readed: { $ne: userId },
      },
      { $addToSet: { readed: userId } },
    );
  }
}
