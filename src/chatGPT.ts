import OpenAI from 'openai';
import dotenv from 'dotenv';
import { logger } from './winston';

dotenv.config({ path: '.env.local' });
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
  organization: process.env.ORGANIZATION_ID,
  project: process.env.PROJECT_ID,
});

export const chatGPT = async (text: string): Promise<string> => {
  let result = '';
  const question = text;
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: question }],
    model: 'gpt-4o-mini',
    stream: true,
  });

  for await (const chunk of chatCompletion) {
    result += chunk.choices[0]?.delta?.content || '';
  }

  logger.info(`질문:${question}, 답변:${result}`);

  return result;
};
