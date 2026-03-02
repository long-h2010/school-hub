import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from 'src/common/base/base.repository';
import { Chat } from 'src/entity-schemas/chat.schema';

@Injectable()
export class ChatRepository extends BaseRepository<Chat> {
  constructor(@InjectModel(Chat.name) private readonly chatModel: Model<Chat>) {
    super(chatModel);
  }

  async findAllByUserId(objId: Types.ObjectId) {
    return await this.chatModel.aggregate([
      {
        $match: {
          'members.user': objId,
          'members.isDeleted': false,
          'members.isRemoved': false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members.user',
          foreignField: '_id',
          as: 'members',
        },
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
                as: 'sender',
              },
            },
            { $unwind: { path: '$sender', preserveNullAndEmptyArrays: true } },

            {
              $project: {
                _id: 1,
                message: 1,
                createdAt: 1,
                sender: {
                  _id: 1,
                  name: 1,
                },
              },
            },
          ],
          as: 'lastMessage',
        },
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
                readed: { $ne: objId },
              },
            },
            { $count: 'unread' },
          ],
          as: 'unread',
        },
      },
      {
        $addFields: {
          unread: { $ifNull: [{ $arrayElemAt: ['$unread.unread', 0] }, 0] },
        },
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
                      cond: { $ne: ['$$p._id', objId] },
                    },
                  },
                  0,
                ],
              },
              null,
            ],
          },
        },
      },
      {
        $addFields: {
          otherUser: '$otherUser._id',
          isGroup: { $gt: [{ $size: '$members' }, 2] },
          displayName: {
            $cond: [
              { $eq: [{ $size: '$members' }, 2] },
              '$otherUser.name',
              '$groupName',
            ],
          },
          displayAvatar: {
            $cond: [
              { $eq: [{ $size: '$members' }, 2] },
              '$otherUser.avatar',
              '$groupAvatar',
            ],
          },
        },
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
            avatar: 1,
          },
          updatedAt: 1,
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);
  }

  async acceptChat(chatId: string, userId: string) {
    return await this.chatModel.findOneAndUpdate(
      {
        _id: chatId,
        'members.user': userId,
      },
      {
        $set: { 'members.$.isAccepted': true },
      },
      { new: true },
    );
  }
}
