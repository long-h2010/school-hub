import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from './post.schema';
import ReportReason from 'src/common/enums/report-reason.enum';
import ReportStatus from 'src/common/enums/report-status.enum';

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: Post;

  @Prop({ default: [ReportReason.INVALID] })
  reason: ReportReason[];

  @Prop({ default: 1 })
  reportCount: number;

  @Prop({ enum: ReportStatus, default: ReportStatus.PENDING })
  status: string;

  @Prop()
  aiReview: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
