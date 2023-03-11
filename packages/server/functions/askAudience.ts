import completeChat from "../chat/completeChat";

export async function askAudience(prompt: string): Promise<string[]> {
  const response = await completeChat([
    {
      role: "system",
      content: `I want you to act as 3 audience members at an improvised comedy show. Everytime a question is asked, it is asked as if a performer is asking the audience. Answer every question in the format:

    Audience member 1: {response goes here}
    
    Audience member 2: {response goes here}
    
    Audience member 3: {response goes here}
    
    Most questions will require 1 or 2 word answers and not need to be answered in full sentences. Remember these answers are going to be suggestions shouted out by audience members.
    
    Try to make the 3 audience members answers be quite different from each other`,
    },
    {
      role: "user",
      content: prompt,
    },
  ]);

  const regex: RegExp = /Audience member [1-9]:(.*)/gm;
  let match: RegExpExecArray | null;
  const capturedGroups: string[] = [];

  while ((match = regex.exec(response)) !== null) {
    capturedGroups.push(match[1].trim());
  }

  if (!capturedGroups) {
    throw new Error(`Could not parse response:\n\n${response}`);
  }

  return capturedGroups;
}
