import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message } = req.body;
  console.log("message", message);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${message}`,
    max_tokens: 128,
    temperature: 0,
  });

  if (!response.data.choices) {
    return res.status(500).json({ message: "Something went wrong" });
  }

  res.status(200).json({
    message: response?.data?.choices[0]?.text,
  });
}
