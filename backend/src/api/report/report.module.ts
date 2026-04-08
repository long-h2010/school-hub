import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportRepository } from './report.repository';
import { ModerationService } from './moderation.service';
import { GeminiModule } from 'src/infrastructure/gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [ReportController],
  providers: [ReportService, ModerationService, ReportRepository]
})
export class ReportModule {}
