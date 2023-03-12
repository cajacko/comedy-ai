import React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import api from "./utils/api";
import askAudienceTemplate from "./config/askAudienceTemplate";

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
      <div style={{ overflow: "auto" }}>
        <Paper style={{ maxWidth: 1000, margin: "0 auto" }}>
          <form onSubmit={ask}>
            <div>
              <TextField
                id="ask-the-audience"
                label="Ask the audience"
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value);
                }}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <Button onClick={ask} variant="contained">
                Ask
              </Button>
            </div>
          </form>
          <div>
            {history.map((item, i) => (
              <div key={i}>
                <Typography variant="h4">{item.question}</Typography>
                {item.answers.map((answer, j) => (
                  <Typography variant="caption" key={j}>
                    {answer}
                  </Typography>
                ))}
              </div>
            ))}
          </div>
        </Paper>
      </div>
    </>
  );
}

export default App;
