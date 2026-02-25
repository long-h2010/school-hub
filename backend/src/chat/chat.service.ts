import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Chat } from 'schemas/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel('Chat') private chatModel: Model<Chat>,
    ) { }

    validateParticipant(user: string, members: Record<string, any>[]) {
        const ps = members.map(p => p.user.toString());
        if (!ps.includes(user)) throw new ForbiddenException('You are not a participant of this chat');
    }

    async create(data: CreateChatDto) {
        const membersLength = data.members.length;
        const userIds = data.members.map(m => m.user);

        if (membersLength == 2) {
            const chat = await this.chatModel.findOne({
                'members.user': { $all: userIds },
                'members.2': { $exists: false }
            });
            
            if (chat) return chat;
        }

        return await this.chatModel.create(data);
    }

    async findOne(userId: string, chatId: string) {
        const chat = await this.chatModel.findById(chatId);
        if (chat) this.validateParticipant(userId, chat.members);
        return chat;
    }

    async findAllByUserId(userId: string) {
        const objId = new mongoose.Types.ObjectId(userId);

        return await this.chatModel.aggregate([
            {
                $match: {
                    'members.user': objId,
                    'members.isDeleted': false,
                    'members.isRemoved': false
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members.user',
                    foreignField: '_id',
                    as: 'members'
                }
            },
            {
                $lookup: {
                    from: 'messages',
                    let: { lastMsgId: '$lastMessage' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$lastMsgId'] } } },

                        {
                            $lookup: {
                                from: 'users',
                                localField: 'sender',
                                foreignField: '_id',
                                as: 'sender'
                            }
                        },
                        { $unwind: { path: '$sender', preserveNullAndEmptyArrays: true } },

                        {
                            $project: {
                                _id: 1,
                                message: 1,
                                createdAt: 1,
                                sender: {
                                    _id: 1,
                                    name: 1
                                }
                            }
                        }
                    ],
                    as: 'lastMessage'
                }
            },
            { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'messages',
                    let: { chatId: '$_id', userId: objId },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$chat', '$$chatId'] },
                                readed: { $ne: objId }
                            }
                        },
                        { $count: 'unread' }
                    ],
                    as: 'unread'
                }
            },
            {
                $addFields: {
                    unread: { $ifNull: [{ $arrayElemAt: ['$unread.unread', 0] }, 0] }
                }
            },
            {
                $addFields: {
                    otherUser: {
                        $cond: [
                            { $eq: [{ $size: '$members' }, 2] },
                            {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: '$members',
                                            as: 'p',
                                            cond: { $ne: ['$$p._id', objId] }
                                        }
                                    },
                                    0
                                ]
                            },
                            null
                        ]
                    }
                }
            },
            {
                $addFields: {
                    otherUser: '$otherUser._id',
                    isGroup: { $gt: [{ $size: '$members' }, 2] },
                    displayName: {
                        $cond: [{ $eq: [{ $size: '$members' }, 2] }, '$otherUser.name', '$groupName']
                    },
                    displayAvatar: {
                        $cond: [{ $eq: [{ $size: '$members' }, 2] }, '$otherUser.avatar', '$groupAvatar']
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    otherUser: 1,
                    displayName: 1,
                    displayAvatar: 1,
                    lastMessage: 1,
                    unread: 1,
                    members: {
                        _id: 1,
                        name: 1,
                        avatar: 1
                    },
                    updatedAt: 1
                }
            },
            { $sort: { updatedAt: -1 } }
        ]);
    }

    async updateLastMessage(chatId: string, messageId: string) {
        return await this.chatModel.findByIdAndUpdate(chatId, { lastMessage: messageId });
    }

    async acceptChat(chatId: string, userId: string) {
        const chat = await this.findOne(userId, chatId);
        const participant = chat.members.find(p => p.user.equals(userId));

        if (participant) {
            participant.isAccepted = true;
            await chat.save();
        }

        return chat;
    }
}
