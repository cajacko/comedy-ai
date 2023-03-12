import React from "react";
import styled from "styled-components";

export interface Props {
  children?: React.ReactNode;
}

export const Container = styled.span`
  font-family: sans-serif;
  font-size: 14px;
`;

const Typography: React.FC<Props> = (props) => {
  return <Container>{props.children}</Container>;
};

export default React.memo(Typography);
