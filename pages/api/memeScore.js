import { WebClient } from '@slack/web-api';
import axios from 'axios';

const token = process.env.SLACK_TOKEN;
console.log('token', token);
const channel = process.env.SLACK_CHANNEL;
const slack = new WebClient(token, { logLevel: 'debug' });

const config = {
  headers: { Authorization: `Bearer ${token}` },
};

const bodyParameters = {
  key: 'value',
};

export default async function memeScore(_, res) {
  try {
    // const instance = axios.create({
    //   baseURL: 'https://slack.com/api/',
    //   timeout: 4000,
    //   headers: {
    //     'Content-type': 'application/x-www-form-urlencoded',
    //     authorization: 'Bearer ' + token,
    //   },
    // });

    // const response = await instance.get(`/conversations.history?channel=${channel}`);
    // const response = await axios.get(`https://slack.com/api/conversations.history?channel=${channel}`, config);
    const response = await slack.conversations.history({ channel });
    console.log('response', response);
    res.status(200).json({ data: 'success', response });
  } catch (e) {
    console.log('e', e);
    res.status(200).json({ data: e });
    // res.status(500).json(e);
  }

  //['keycap_ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one'])
}
