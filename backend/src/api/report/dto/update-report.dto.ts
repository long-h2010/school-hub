import ReportStatus from "src/common/enums/report-status.enum";

export class UpdateReportDto {
  status: ReportStatus;
  aiReview: string;
}
