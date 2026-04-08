import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async create(data: CreateReportDto) {
    if (await this.reportRepository.findOne({ post: data.post }, '', false))
      return await this.update(data);
    else return await this.reportRepository.create(data);
  }

  async getList(query: any) {
    return await this.reportRepository.getList(query);
  }

  async update(data: UpdateReportDto) {
    return this.reportRepository.update(
      { post: data.post },
      { $inc: { reportCount: 1 } },
    );
  }
}
