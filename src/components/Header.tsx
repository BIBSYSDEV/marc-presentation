import React from 'react';
import styled from 'styled-components';
import SiktLogo from '../resources/Logo-Sikt-Primaerlogo-Moerk_medium_size.png';

const StyledHeader = styled.div`
  height: 5rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background-color: #c9d2d8;
`;

const StyledHeading = styled.div`
  color: rgb(0, 0, 0);
  font-family: Crimson Text, serif;
  font-size: 1.5rem;
  font-weight: 400;
  margin-left: 1rem;
`;

const StyledLogo = styled.img`
  margin-right: 1rem;
  height: auto;
  max-height: 50%;
`;

const Header = () => {
  return (
    <StyledHeader data-testid="page-header">
      <StyledHeading> Marc-visning</StyledHeading>
      <StyledLogo src={SiktLogo} alt="Sikt logo" />
    </StyledHeader>
  );
};

export default Header;
