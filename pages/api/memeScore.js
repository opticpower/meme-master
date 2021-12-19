import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_TOKEN;
const channel = process.env.SLACK_CHANNEL;
const slack = new WebClient(token, { logLevel: 'debug' });

const handler = nextConnect({
  onError(error, _, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.get(async (req, res) => {
  try {
    const response = await slack.reactions.get({ channel });
    console.log('response', response);
  } catch (e) {
    console.log('e', e);
    res.status(500).json(e);
  }

  //['keycap_ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one'])

  res.status(200).json({ data: 'success', response });
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
