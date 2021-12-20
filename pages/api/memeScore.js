import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_TOKEN;
const channel = process.env.SLACK_CHANNEL;
const slack = new WebClient(token, { logLevel: 'debug' });

const DEFAULT_SCORE = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10; // We'll remove the initially given score to be more precise.

const REACTION_NAME_VALUE_MAP = {
  keycap_ten: 10,
  nine: 9,
  eight: 8,
  seven: 7,
  six: 6,
  five: 5,
  four: 4,
  three: 3,
  two: 2,
  one: 1,
};

const memeScore = async (_, res) => {
  try {
    const response = await slack.conversations.history({ channel });

    const lastFileMessage = response.messages.find(message => message.files?.length && message.reactions?.length);

    if (!lastFileMessage) {
      res.status(500).json('No file message found in provided channel');
    }
    const { reactionScore, totalVoters } = lastFileMessage.reactions.reduce(
      (acc, reaction) => {
        if (!REACTION_NAME_VALUE_MAP[reaction.name]) {
          return acc;
        }

        return {
          reactionScore: acc.reactionScore + reaction.count * REACTION_NAME_VALUE_MAP[reaction.name],
          totalVoters: acc.totalVoters + reaction.count - 1, // -1 to remove the given one
        };
      },
      {
        reactionScore: 0,
        totalVoters: 0,
      }
    );

    if (!totalVoters) {
      res.status(500).json('No voters reacted to the last file message in the channel');
    }
    const reactionAverageScore = ((reactionScore - DEFAULT_SCORE) / totalVoters).toFixed(2);

    await slack.chat.postMessage({
      channel,
      thread_ts: lastFileMessage.ts,
      text: `Meme Average Score: ${reactionAverageScore}`,
    });
    res.status(200).json({ data: 'success', message: 'Score calculated and posted.', reactionAverageScore });
  } catch (e) {
    console.log('Error!', e);
    res.status(500).json(e);
  }
};

export default memeScore;
