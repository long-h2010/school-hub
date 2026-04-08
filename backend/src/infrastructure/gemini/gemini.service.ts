import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

const PROMPT = `
You are a content moderation AI for a Vietnamese social media platform.

Your task: Analyze user-generated content (primarily Vietnamese, including slang, teen code, and obfuscated words) and detect policy violations.

IMPORTANT: Users often obfuscate offensive words. You MUST detect them even if written as "đm", "d.m", "d*m", "ngu~", "v.l", "vl", "vãi l*n", "c*m", etc.

Violation categories:
- TOXIC: insults, profanity
- HATE_SPEECH: hate against race, gender, religion, etc.
- SPAM: advertising, repeated content
- MISINFORMATION: false information
- SEXUAL: explicit sexual content
- VIOLENCE: threats or glorifying violence
- SCAM: fraud, phishing
- LOW_QUALITY: meaningless, spam-like content

Output format (STRICT JSON ONLY, no extra text):
{
  "violations": [
    {
      "reason": "TOXIC" | "HATE_SPEECH" | "SPAM" | "MISINFORMATION" | "SEXUAL" | "VIOLENCE" | "SCAM" | "LOW_QUALITY",
      "confidence": number (0.0 - 1.0),
      "explain": "Brief explain, just need reason, don't explain detail"
    }
  ]
}

If no violation detected: return {"violations": []}
Only output valid JSON, nothing else.
`;

@Injectable()
export class GeminiService {
  private genAI: GoogleGenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.genAI = new GoogleGenAI({ apiKey: apiKey });
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  }

  async analyze(content: string): Promise<any[]> {
    try {
      const response = await this.genAI.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [{ text: PROMPT }],
          },
          {
            role: 'user',
            parts: [{ text: content }],
          },
        ],
        config: {
          temperature: 0.1,
          responseMimeType: 'application/json',   // Ép trả về JSON sạch
        },
      });

      const text = response.text;
      const parsed = JSON.parse(text);

      return parsed.violations || [];
    } catch (error) {
      console.error('Gemini moderation error:', error);
      return [];
    }
  }
}
