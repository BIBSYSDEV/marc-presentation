import React, { FC } from 'react';
import styled from 'styled-components';
import UnitLogo from '../resources/logoUnit.png';

const Bar = styled.div`
  height: 5rem;
  width: 100%;
  margin-bottom: 1rem;
  box-shadow: 0px 5px 5px grey;
  background-color: white;
`;
const Title = styled.h1`
  color: rgb(40, 75, 99);
  position: absolute;
  font-size: 1.5rem;
  font-family: Crimson Text, serif;
  font-weight: 400;
  line-height: 5rem;
  margin-left: 1rem;
  margin-top: 0rem;
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
  width: 10rem;
  right: 1rem;
  top: 1rem;
  line-height: 5rem;
`;

const Header: FC = () => {
  return (
    <Bar>
      <Title>
        MARC-visning <Divider></Divider>
      </Title>

      <LogoImgWrapper src={UnitLogo} alt="Unit logo"></LogoImgWrapper>
    </Bar>
  );
};

export default Header;
