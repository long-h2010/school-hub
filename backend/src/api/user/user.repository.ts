import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base/base.repository';
import { User } from 'src/entity-schemas/user.schema';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }

  async overview() {
    const result = await this.userModel.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: 'count' }],

          monthly: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(
                    new Date().setMonth(new Date().getMonth() - 11),
                  ),
                },
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
          ],
        },
      },
      {
        $project: {
          total: {
            $ifNull: [{ $arrayElemAt: ['$totalUsers.count', 0] }, 0],
          },
          monthly: 1,
          thisMonth: { $arrayElemAt: ['$monthly.count', -1] },
          lastMonth: { $arrayElemAt: ['$monthly.count', -2] },
          growthPercent: {
            $multiply: [
              {
                $divide: [
                  {
                    $subtract: [
                      { $arrayElemAt: ['$monthly.count', -1] },
                      { $arrayElemAt: ['$monthly.count', -2] },
                    ],
                  },
                  { $arrayElemAt: ['$monthly.count', -2] },
                ],
              },
              100,
            ],
          },
        },
      },
    ]);

    return result[0] || {};
  }
}
