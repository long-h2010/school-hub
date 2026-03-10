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

export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: any) {
    return await this.model.create(data);
  }

  async findAll() {
    return await this.model.find().exec();
  }

  async findOne(query: FilterQuery<T>, select?: string, throwException: boolean = true) {
    const user = await this.model.findOne(query).select(select).exec();
    if (!user && throwException) throw new NotFoundException('Resource not found');
    return user;
  }

  async findMany(options: FindOptions<T>) {
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

  async update(query: FilterQuery<T>, data: any) {
    return await this.model.findOneAndUpdate(query, data).exec();
  }

  async remove(query: FilterQuery<T>) {
    return await this.model.findOneAndDelete(query).exec();
  }
}
