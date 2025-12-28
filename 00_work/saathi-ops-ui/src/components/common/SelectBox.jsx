import React from 'react';
import styled from 'styled-components';

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 243px;
  height: 243px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition:
    border-color 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  &:hover {
    border-color: #141482;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  ${(props) =>
    props.selected &&
    `
    border-color: #141482;
    box-shadow: 0px 4px 8px rgba(10, 122, 255, 0.2);
  `}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  background-color: #ecefff;
  border-radius: 50%;
  margin-bottom: 8px;
`;

const Label = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  padding: 10px;
  color: ${(props) => (props.selected ? '#141482' : '#3B3B3B')};
`;

const StyledImg = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
`;

const SelectBox = ({ label, icon, selected = false, onClick = () => {} }) => {
  return (
    <BoxContainer selected={selected} onClick={onClick}>
      <IconWrapper>
        <StyledImg src={icon} alt="select-image" $width="55px" $height="55px" />
      </IconWrapper>
      <Label selected={selected}>{label}</Label>
    </BoxContainer>
  );
};

export default SelectBox;
