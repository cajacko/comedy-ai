import React from "react";
import styled from "styled-components";
import { Container as TypographyContainer } from "./Typography";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export interface Props {
  children?: React.ReactNode;
  onClick?: ButtonProps["onClick"];
}

const Container = styled(TypographyContainer).attrs({ as: "button" })`
  cursor: pointer;
`;

const Button: React.FC<Props> = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};

export default React.memo(Button);
