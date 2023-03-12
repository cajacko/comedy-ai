import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import api from "./utils/api";
import askAudienceTemplate from "./config/askAudienceTemplate";

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

const stageHeight = "45vh";

const Audience = styled.div`
  min-width: 100vw;
  max-height: 50vh;
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
  min-width: 100vw;
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

function App() {
  const [question, setQuestion] = React.useState("");
  const [history, setHistory] = React.useState<
    Array<{ question: string; answers: string[] }>
  >([]);
  const [conversationId, setConversationId] = React.useState<
    string | undefined
  >();

  const ask = React.useCallback(
    (event: React.FormEvent | React.MouseEvent) => {
      event.preventDefault();

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

  return (
    <>
      <GlobalStyle />
      <Audience />
      <Actor />
      <Background />
      <Stage />
    </>
  );
}

export default App;
