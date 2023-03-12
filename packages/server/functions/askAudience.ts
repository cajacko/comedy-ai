import { v4 as uuid } from "uuid";
import completeChat, { Message } from "../chat/completeChat";
import { RequestHandler } from "../types/RequestHandler";
import { NumberOfAnswers } from "../shared/types/api";

interface Conversation {
  lastUpdated: Date;
  messages: Message[];
}

// TODO: Don't let there be multiple in flight promises for the same conversation
// TODO: Remove conversations if old

const conversations: Record<string, Conversation | undefined> = {};

async function askAudience(
  template: string;
  prompt: string,
  conversationId: string,
  options: { numberOfAnswers?: NumberOfAnswers } = {}
): Promise<string[]> {
  const { numberOfAnswers = 3 } = options;
  const conversation = conversations[conversationId];

  const startingMessage = template.replace(/{numberOfAnswers}/g, numberOfAnswers.toString());

  // Continue conversation if it exists, otherwise start a new one
  const messages: Message[] = conversation?.messages ?? [
    {
      role: "system",
      content: startingMessage,
    },
  ];

  messages.push({
    role: "user",
    content: prompt,
  });

  const response = await completeChat(messages);

  const regex: RegExp = /Audience member [1-9]:(.*)/gm;
  let match: RegExpExecArray | null;
  const capturedGroups: string[] = [];

  while ((match = regex.exec(response)) !== null) {
    capturedGroups.push(match[1].trim());
  }

  if (!capturedGroups || capturedGroups.length !== numberOfAnswers) {
    throw new Error(`Could not parse response:\n\n${response}`);
  }

  messages.push({
    role: "assistant",
    content: response,
  });

  conversations[conversationId] = {
    messages,
    lastUpdated: new Date(),
  };

  console.log(messages);

  return capturedGroups;
}

const requestHandler: RequestHandler<"/functions/ask-audience"> = async (
  req,
  res
) => {
  try {
    const conversationId = req.body.conversationId ?? uuid();

    const answers = await askAudience(req.body.template, req.body.question, conversationId, {
      numberOfAnswers: req.body.numberOfAnswers,
    });

    res.json({ success: true, response: { answers, conversationId } });
  } catch (error) {
    console.error(error);

    res.status(500);

    res.json({
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error, check logs",
    });
  }
};

export default requestHandler;
