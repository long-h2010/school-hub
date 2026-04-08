export enum ReportStatus {
  PENDING = 'pending',
  DISMISSED = 'dismissed',
  PROCESSED = 'processed',
}

export enum ReportReason {
  INVALID = 'invalid',
  TOXIC = 'toxic',
  SPAM = 'spam',
  MISINFORMATION = 'misinformation',
  HATE_SPEECH = 'hate speech',
  NSFW = 'nsfw',
  VIOLENCE = 'violence',
  SEXUAL = 'sexual',
  SCAM = 'scam',
  LOW_QUANLITY = 'low quanlity',
  OTHER = 'other',
}
