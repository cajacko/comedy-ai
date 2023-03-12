import React from "react";
import styled from "styled-components";
import Typography from "./Typography";

export interface Props {
  children?: React.ReactNode;
  side?: "left" | "right";
  style?: React.CSSProperties;
}

const Container = styled.div`
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  text-align: center;
`;

const AudienceSpeech: React.FC<Props> = (props) => {
  return (
    <Container {...props}>
      <Typography>{props.children}</Typography>
    </Container>
  );
};

export default React.memo(AudienceSpeech);
