import { NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';

const LIMIT = 15;

interface FindOptions<T> {
  filter?: FilterQuery<T>;
  select?: string;
  sort?: Record<string, 1 | -1>;
  page?: number;
  limit?: number;
  populate?: any;
  lean?: boolean;
}

type RelationConfig = {
  from: string;
  localField: string;
  foreignField: string;
  as: string;

  pipeline?: RelationConfig[];

  project?: any;
};

type AggregateOptions = {
  filter?: any;
  page?: number;
  limit?: number;
  sort?: any;

  relations?: RelationConfig[];

  search?: {
    keyword: string;
    fields: string[];
  };

  select?: any;
};

export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: any) {
    return await this.model.create(data);
  }

  async findAll() {
    return await this.model.find().exec();
  }

  async findOne(
    query: FilterQuery<T>,
    select?: string,
    throwException: boolean = true,
  ) {
    const record = await this.model.findOne(query).select(select).exec();
    if (!record && throwException)
      throw new NotFoundException('Resource not found');
    return record;
  }

  async findMany(options: FindOptions<T> = {}) {
    const {
      filter = {},
      select,
      sort = { createdAt: -1 },
      page = 1,
      limit = LIMIT,
      populate,
      lean = true,
    } = options;

    const skip = (page - 1) * limit;

    let query = this.model
      .find(filter)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (populate) {
      query = query.populate(populate);
    }

    return await query.lean(lean).exec();
  }

  buildLookup(relation: RelationConfig): any {
    const lookup: any = {
      from: relation.from,
      localField: relation.localField,
      foreignField: relation.foreignField,
      as: relation.as,
    };

    const pipeline: any[] = [];

    if (relation.pipeline) {
      relation.pipeline.forEach((child) => {
        pipeline.push({
          $lookup: this.buildLookup(child),
        });

        pipeline.push({
          $unwind: {
            path: `$${child.as}`,
            preserveNullAndEmptyArrays: true,
          },
        });
      });
    }

    if (relation.project) {
      pipeline.push({
        $project: relation.project,
      });
    }

    if (pipeline.length) {
      lookup.pipeline = pipeline;
    }

    return lookup;
  }

  async getManyAdvanced(options: AggregateOptions = {}) {
    const {
      filter = {},
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
      relations = [],
      search,
      select,
    } = options;

    const skip = (page - 1) * limit;
    const pipeline: any[] = [];

    if (Object.keys(filter).length) {
      pipeline.push({ $match: filter });
    }

    relations.forEach((relation) => {
      pipeline.push({
        $lookup: this.buildLookup(relation),
      });

      pipeline.push({
        $unwind: {
          path: `$${relation.as}`,
          preserveNullAndEmptyArrays: true,
        },
      });
    });

    if (search?.keyword && search.fields?.length) {
      pipeline.push({
        $match: {
          $or: search.fields.map((field) => ({
            [field]: {
              $regex: search.keyword,
              $options: 'i',
            },
          })),
        },
      });
    }

    pipeline.push({ $sort: sort });

    if (select) {
      pipeline.push({
        $project: select,
      });
    }

    pipeline.push({
      $facet: {
        founds: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    });

    pipeline.push({
      $project: {
        founds: 1,
        total: {
          $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0],
        },
      },
    });

    const result = await this.model.aggregate(pipeline);
    return result[0];
  }

  async update(query: FilterQuery<T>, data: any) {
    return await this.model.findOneAndUpdate(query, data, { new: true }).exec();
  }

  async remove(query: FilterQuery<T>) {
    return await this.model.findOneAndDelete(query).exec();
  }

  async count() {
    return await this.model.countDocuments().exec();
  }
}
