import express from 'express';
import dotenv from 'dotenv';
import { WebClient } from '@slack/web-api';
import { chatGPT } from './chatGPT';
import { App } from '@slack/bolt';

dotenv.config({ path: '.env.local' });
dotenv.config();
const app = express();

app.use(express.json());

const slackToken = process.env.SLACK_TOKEN;
const botToken = process.env.SLACK_BOT_TOKEN;
const slackAppToken = process.env.SLACK_APP_TOKEN;
export const slackApp = new App({
  token: botToken,
  signingSecret: slackToken,
  socketMode: true,
  appToken: slackAppToken,
});

// Slack 이벤트 핸들러 설정
slackApp.event('app_mention', async ({ event, say }) => {
  try {
    const question = event.text;
    const answer = await chatGPT(question);
    // const answer = 'Test';
    await say(`<@${event.user}> ${answer}`);
  } catch (error) {
    console.error(error);
  }
});

slackApp.start();

//main get route
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

export default app;
