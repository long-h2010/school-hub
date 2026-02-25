import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'schemas/message.schema';
import { ChatService } from 'src/chat/chat.service';
import SendMessageDto from './dto/send-message.dto';
import CreateMessageDto from './dto/create-message.dto';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel('Message') private messageModel: Model<Message>,
        private readonly chatService: ChatService
    ) {}

    async sendMessage(userId: string, chatId: string, data: SendMessageDto) {
        let chat: any;

        if (!chatId) {
            chat = await this.chatService.create({
                members: [
                    { user: userId, isAccepted: true },
                    { user: data.sendTo }
                ]
            });
        } else {
            chat = await this.chatService.findOne(userId, chatId)
        }

        const chatRoom = chat._id.toString();

        const msgData: CreateMessageDto = {
            chat: chatRoom,
            sender: userId,
            message: data.message,
            readed: [userId]
        }

        const message = await this.messageModel.create(msgData);
        await this.chatService.updateLastMessage(chatRoom, message._id.toString());

        return message.populate('sender', 'name avatar');
    }

    async findMessageByChat(chatId: string) {
        return await this.messageModel.find({ chat: chatId }).populate('sender', 'name avatar');
    }
    
    async maskAsRead(userId: string, chatId: string) {
        return await this.messageModel.updateMany(
            { 
                chat: chatId,
                readed: { $ne: userId }
            },
            { $addToSet: { readed: userId } }
        );
    }
}
