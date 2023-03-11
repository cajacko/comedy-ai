import openai from "../utils/openai";
import { ChatCompletionRequestMessage } from "openai";
import withDevCache from "../utils/withDevCache";

const completeChat = withDevCache(
  async (messages: ChatCompletionRequestMessage[]): Promise<string> => {
    console.log("Calling openai");

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    return response.data.choices?.[0].message?.content ?? "";
  },
  (messages) => JSON.stringify(messages),
  { type: "file", cacheFileKey: "completeChat" }
);

export default completeChat;
