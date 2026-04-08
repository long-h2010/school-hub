import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base/base.repository';
import { Report } from 'src/entity-schemas/report.schema';

@Injectable()
export class ReportRepository extends BaseRepository<Report> {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
  ) {
    super(reportModel);
  }

  async getList(query: any) {
    console.log(query)
    return await this.getManyAdvanced({
      filter: {
        ...(query.reason && { reason: query.reason }),
        ...(query.status && { status: query.status }),
      },

      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,

      relations: [
        {
          from: 'posts',
          localField: 'post',
          foreignField: '_id',
          as: 'post',
          project: {
            _id: 1,
            author: 1,
            content: 1,
            images: 1,
            videos: 1,
          },
          pipeline: [
            {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              as: 'author',
              project: {
                _id: 1,
                name: 1,
                avatar: 1,
              },
            },
          ],
        },
      ],
    });
  }
}
