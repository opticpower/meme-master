import nextConnect from 'next-connect'
import multiparty from 'multiparty'
import { WebClient } from '@slack/web-api'
import { createReadStream } from 'fs'

const token = process.env.SLACK_TOKEN
const channel = process.env.SLACK_CHANNEL
const slack = new WebClient(token)

const handler = nextConnect({
    onError(error, _, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` })
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

handler.use(async (req, _, next) => {
    const form = new multiparty.Form()

    await form.parse(req, (_, fields, files) => {
        req.body = fields
        req.files = files
        next()
    })
});

handler.post(async (req, res) => {
    for (const fileArry of Object.values(req.files)) {
        const file = fileArry[0];
        console.log('Uploading this damn file', file)
        const result = await slack.files.upload({
            filename: file.fieldName,
            file: createReadStream(file.path),
            channels: channel,
        })

        const timestamp = result.file.shares.public[channel][0].ts

        for (const name of ['keycap_ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one']) {
            await slack.reactions.add({
                name,
                channel,
                timestamp
            });
        }
    }

    res.status(200).json({ data: 'success' });
});

export default handler;

export const config = {
    api: {
        bodyParser: false
    }
}