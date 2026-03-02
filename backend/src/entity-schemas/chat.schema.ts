import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Message } from './message.schema';

@Schema({ timestamps: true })
export class Chat {
    @Prop()
    groupName: string;

    @Prop()
    groupAvatar: string;
    
    @Prop([raw({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isAccepted: { type: Boolean, default: false }, // user has accepted the chat
        isRemoved: { type: Boolean, default: false }, // user has left the chat
        isDeleted: { type: Boolean, default: false }, // user has deleted the chat
        joinedAt: { type: Date, default: Date.now }
    })])
    members: Record<string, any>[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
    lastMessage: Message;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
