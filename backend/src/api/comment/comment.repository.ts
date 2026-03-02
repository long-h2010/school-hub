import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base/base.repository';
import { Comment } from 'src/entity-schemas/comment.schema';

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {
    super(commentModel);
  }

  async reply(id: string, query: any) {
    const comment = await this.commentModel.findByIdAndUpdate(
      id,
      { $push: { replies: query } },
      { new: true },
    );
    return comment;
  }
}
