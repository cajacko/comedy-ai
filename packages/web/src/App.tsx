import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  container: {
    maxHeight: 440,
  },
  table: {
    minWidth: 650,
  },
});

function App() {
  const classes = useStyles();
  const [question, setQuestion] = React.useState("");
  const [answers, setAnswers] = React.useState<string[]>([]);

  const ask = React.useCallback(() => {
    fetch(`${process.env.REACT_APP_API_URL}functions/ask-the-audience`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) throw new Error("Did not receive a success response");

        setAnswers(res.data);
      })
      .catch(console.error);
  }, [question]);

  return (
    <>
      <div style={{ overflow: "auto" }}>
        <Paper style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div>
            <TextField
              id="ask-the-audience"
              label="Ask the audience"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                setAnswers([]);
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <Button onClick={ask} variant="contained">
              Ask
            </Button>
          </div>
          <div>
            {answers.map((answer, i) => (
              <Typography key={i}>{answer}</Typography>
            ))}
          </div>
        </Paper>
      </div>
    </>
  );
}

export default App;
