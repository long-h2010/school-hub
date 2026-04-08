import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Following {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  follower: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  following: User;
}

export const FollowingSchema = SchemaFactory.createForClass(Following);
