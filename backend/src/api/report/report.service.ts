import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async create(data: CreateReportDto) {
    if (await this.reportRepository.findOne({ post: data.post }, '', false))
      return await this.updateCountReport(data.post);
    else return await this.reportRepository.create(data);
  }

  async getList(query: any) {
    return await this.reportRepository.getList(query);
  }

  async update(id: string, data: UpdateReportDto) {
    return await this.reportRepository.update({ _id: id }, { ...data });
  }

  async updateCountReport(postId: string) {
    return this.reportRepository.update(
      { post: postId },
      { $inc: { reportCount: 1 } },
    );
  }

  async delete(id: string) {
    return this.reportRepository.remove({ _id: id });
  }
}
