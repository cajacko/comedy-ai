import { Configuration, OpenAIApi } from "openai";

function getOpenai(apiKey: string) {
  const configuration = new Configuration({
    apiKey,
  });

  const openai = new OpenAIApi(configuration);

  return openai;
}

export default getOpenai;
