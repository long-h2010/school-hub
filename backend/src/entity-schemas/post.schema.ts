import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import VisibilityType from 'src/common/enums/visibility.enum';

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ default: VisibilityType.PUBLIC })
  visibility: VisibilityType;

  @Prop()
  content: string;

  @Prop()
  images: string[];

  @Prop()
  videos: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  likes: User[];

  @Prop({ default: 0 })
  comments: number;

  @Prop({ default: null })
  deletedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
