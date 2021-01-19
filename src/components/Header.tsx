import React, { FC } from "react";
import AppBar from "@material-ui/core/AppBar";
import styled from "styled-components";

const Title = styled.div`
  height: 20rem;
  width: 30rem;
`;

const Header: FC = () => {
  return (
    <AppBar>
      <Title>Marc Presentation</Title>
    </AppBar>
  );
};

export default Header;
