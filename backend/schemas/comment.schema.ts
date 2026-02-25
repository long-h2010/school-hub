import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { Post } from './post.schema';

@Schema({ timestamps: true })
export class Comment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    post: Post;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: User;

    @Prop({ required: true })
    content: string;

    @Prop({ default: 0 })
    likeCounting: number;

    @Prop({ default: 0 })
    replyCounting: number;

    @Prop([raw({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        likeCounting: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
    })])
    replies: Record<string, any>[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
