import React, { FC } from "react";
import styled from "styled-components";
import UnitLogo from "../resources/logoUnit.png";

const Bar = styled.div`
  height: 5rem;
  width: 100%;
  background-color: rgba(99, 34, 107, 0.15);
`;
const Title = styled.span`
  position: absolute;
  font-size: 1.5rem;
  font-family: Crimson Text, serif;
  font-weight: 400;
  line-height: 5rem;
  margin-left: 1rem;
`;

const Divider = styled.span`
  line-height: 5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-right: 1rem;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
`;

const LogoImgWrapper = styled.img`
  position: absolute;
  height: 3rem;
  width: 15rem;
  right: 1rem;
  top: 1rem;
  line-height: 5rem;
`;

const Header: FC = () => {
  return (
    <Bar>
      <Title>
        Marc Presentation <Divider></Divider>
      </Title>

      <LogoImgWrapper src={UnitLogo} alt="Unit logo"></LogoImgWrapper>
    </Bar>
  );
};

export default Header;
