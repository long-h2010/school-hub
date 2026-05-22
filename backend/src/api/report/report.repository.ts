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
            deletedAt: 1,
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
                status: 1,
              },
            },
          ],
        },
      ],
    });
  }

  async overview() {
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();

    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = lastMonthDate.getMonth() + 1;
    const lastYear = lastMonthDate.getFullYear();

    const [total, pendingReview, monthly] = await Promise.all([
      this.reportModel.countDocuments(),
      this.reportModel.countDocuments({ status: 'pending' }),
      this.reportModel.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
    ]);

    const thisMonthCount =
      monthly.find((m) => m._id.month === thisMonth && m._id.year === thisYear)
        ?.count ?? 0;

    const lastMonthCount =
      monthly.find((m) => m._id.month === lastMonth && m._id.year === lastYear)
        ?.count ?? 0;

    const growthPercent =
      lastMonthCount === 0
        ? 100
        : ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;

    return { total, pendingReview, growthPercent, monthly };
  }
}
