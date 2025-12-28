import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.img`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

const Text = styled.span`
  font-size: 14px;
  color: #606c85;
`;

const InlineIconText = ({ icon, altText = 'icon', text, iconSize = 20 }) => {
  return (
    <Container>
      <Icon src={icon} alt={altText} size={iconSize} />
      <Text>{text}</Text>
    </Container>
  );
};

export default InlineIconText;
