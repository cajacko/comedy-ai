import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import api from "./utils/api";
import askAudienceTemplate from "./config/askAudienceTemplate";
import AudienceSpeech from "./components/AudienceSpeech";
import Button from "./components/Button";

const GlobalStyle = createGlobalStyle`
  body, #root {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex: 1;
    margin: 0;
    overflow: hidden;
  }
`;

const audienceHeight = "40vh";
const stageHeight = `calc(${audienceHeight} - 5vh)`;

const Audience = styled.div`
  min-width: 100vw;
  max-height: ${audienceHeight};
  height: 100%;
  width: 100%;
  position: absolute;
  bottom: 0;
  background-image: url("/audience.png");
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 10;
`;

const Background = styled.div`
  max-height: 75vh;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  background-image: url("/stage.png");
  background-position: bottom;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 7;
`;

const Actor = styled.div`
  height: 30vh;
  width: 100%;
  position: absolute;
  bottom: ${stageHeight};
  left: 20px;
  background-image: url("/actor.png");
  background-position: bottom left;
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 8;
`;

const Stage = styled.div`
  height: ${stageHeight};
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #4e3636;
  z-index: 9;
`;

const ActorSpeech = styled.form`
  background-color: white;
  position: absolute;
  z-index: 11;
  top: 50px;
  left: 100px;
  right: 50px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
  cursor: pointer;
`;

const ActorSpeechBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const TextInput = styled.input`
  border: none;
  position: relative;
  z-index: 99;

  &:focus {
    outline: none;
  }
`;

const SubmitContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Submit = styled(Button)`
  min-width: 100px;
  position: relative;
  z-index: 99;
`;

const AudienceSpeechContainer = styled(AudienceSpeech)`
  position: absolute;
  z-index: 12;
`;

function App() {
  const input = React.useRef<HTMLInputElement>(null);
  const [history, setHistory] = React.useState<
    Array<{ question: string; answers: string[] }>
  >([
    // {
    //   question: "Give me a location",
    //   answers: [
    //     "A submarine",
    //     "A crowded elevator!",
    //     "A tiny coffee shop!",
    //     "A spaceship cockpit!",
    //     "A dentist's office!",
    //   ],
    // },
  ]);

  const lastResponse = history[0];
  const { answers } = lastResponse || {};

  const [question, setQuestion] = React.useState(lastResponse?.question ?? "");

  const [conversationId, setConversationId] = React.useState<
    string | undefined
  >();

  const ask = React.useCallback(
    (event: React.FormEvent | React.MouseEvent) => {
      event.preventDefault();
      input.current?.blur();

      const thisQuestion = question;

      api("/functions/ask-audience", "post", {
        question: thisQuestion,
        conversationId,
        numberOfAnswers: 5,
        template: askAudienceTemplate,
      })
        .then((res) => {
          setHistory((prevHistory) => [
            { question: thisQuestion, answers: res.answers },
            ...prevHistory,
          ]);
          setConversationId(res.conversationId);
        })
        .catch(console.error);
    },
    [question, conversationId]
  );

  const focusOnInput = React.useCallback(() => {
    input.current?.focus();
  }, []);

  return (
    <>
      <GlobalStyle />
      <ActorSpeech onSubmit={ask}>
        <TextInput
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask the audience"
          ref={input}
        />
        <SubmitContainer>
          <Submit onClick={ask}>Ask</Submit>
        </SubmitContainer>
        <ActorSpeechBackground onClick={focusOnInput} />
      </ActorSpeech>
      {answers?.map((answer, i) => (
        <AudienceSpeechContainer
          key={i}
          side={!!(i % 2) ? "left" : "right"}
          style={{
            right: !!(i % 2) ? 10 : undefined,
            left: !!(i % 2) ? undefined : 10,
            bottom: 50 * (i + 1),
            width: 200,
          }}
        >
          {answer}
        </AudienceSpeechContainer>
      ))}
      <Audience />
      <Actor />
      <Background />
      <Stage />
    </>
  );
}

export default App;
