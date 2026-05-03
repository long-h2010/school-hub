import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ModerationService } from './moderation.service';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly moderationService: ModerationService,
  ) {}

  @Post()
  async create(@Body() data: CreateReportDto) {
    return await this.reportService.create(data);
  }

  @Get()
  async getList(@Query() query) {
    return await this.reportService.getList(query);
  }

  @Post('moderation')
  async moderation(@Body() body) {
    return await this.moderationService.evaluate(body.content);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateReportDto) {
    return await this.reportService.update(id, data);
  }

  @Delete(':id')
  async detele(@Param('id') id) {
    return await this.reportService.delete(id);
  }
}
