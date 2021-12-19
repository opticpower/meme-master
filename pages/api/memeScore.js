import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_TOKEN;
const channel = process.env.SLACK_CHANNEL;
const slack = new WebClient(token, { logLevel: 'debug' });

export default async function memeScore(_, res) {
  try {
    const response = await slack.reactions.get({ channel });
    console.log('response', response);
  } catch (e) {
    console.log('e', e);
  }

  //['keycap_ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one'])

  res.status(200).json({ data: 'success' });
}
