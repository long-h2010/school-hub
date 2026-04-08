import { Injectable } from '@nestjs/common';
import ReportReason from 'src/common/enums/report-reason.enum';
import { GeminiService } from 'src/infrastructure/gemini/gemini.service';

const ModerationConfig = {
  TOXIC: { weight: 25, threshold: 0.5 },
  HATE_SPEECH: { weight: 50, threshold: 0.5 },
  SPAM: { weight: 30, threshold: 0.7 },
  MISINFORMATION: { weight: 35, threshold: 0.6 },
  NSFW: { weight: 30, threshold: 0.5 },
  SEXUAL: { weight: 50, threshold: 0.5 },
  VIOLENCE: { weight: 60, threshold: 0.5 },
  SCAM: { weight: 70, threshold: 0.6 },
  LOW_QUALITY: { weight: 10, threshold: 0.5 },
  OTHER: { weight: 5, threshold: 1 },
};

@Injectable()
export class ModerationService {
  constructor(private geminiService: GeminiService) {}

  private normalizeContent(content: string): string {
    return content
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  private detectToxic(content: string): boolean {
    const patterns = [/d[\W_]*m/i, /n[\W_]*g[\W_]*u/i, /v[\W_]*l/i];
    return patterns.some((r) => r.test(content));
  }

  private async analyzeAI(content: string) {
    return await this.geminiService.analyze(content);
  }

  private calculateScore(violations: any[]) {
    let score = 100;
    const reasons: string[] = [];

    for (const v of violations) {
      const config = ModerationConfig[v.reason];
      if (!config) continue;

      if (v.confidence >= config.threshold) {
        const penalty = config.weight * v.confidence;
        score -= penalty;
        reasons.push(`${v.reason}: ${v.explain}`);
      }
    }

    score = Math.max(0, Math.round(score));

    return {
      score,
      level: this.getLevel(score),
      reasons,
    };
  }

  private getLevel(score: number) {
    if (score > 80) return 'safe';
    if (score > 50) return 'warning';
    return 'danger';
  }

  async evaluate(content: string) {
    // 1. Rule check
    const ruleViolations: any[] = [];

    // 2. Normalize
    const normalized = this.normalizeContent(content);

    // 3. AI
    const aiViolations = await this.analyzeAI(normalized);

    // 4. Merge
    const allViolations = [...ruleViolations, ...aiViolations];

    // 5. Score
    const result = this.calculateScore(allViolations);

    // 6. Hard block
    const hardBlock = allViolations.some(
      (v) => v.reason === ReportReason.SCAM && v.confidence > 0.8,
    );

    return {
      isViolation: result.level === 'danger' || hardBlock,
      ...result,
      raw: {
        rules: ruleViolations,
        ai: aiViolations,
      },
    };
  }
}
