import React from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';

const StyledCheckbox = styled.input`
  display: none;
  width: 14px;
  height: 14px;
  border: 1px solid #fff;
  cursor: pointer;
  color: #141482 !important;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`;

const StyledLabel = styled.label`
  margin: 0 0 0 30px;
  font-family: Poppins;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  color: #232323;
  cursor: pointer;
`;

const StyledDiv = styled.div`
  position: relative;
`;
const DisplayBox = styled.div`
  position: absolute;
  top: 2px;
  left: 0;
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #0a7aff;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledSelector = styled.div`
  background-color: #0a7aff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
`;
const Radiobutton = ({ label, checked = false, onChange }) => {
  return (
    <StyledDiv>
      <StyledCheckbox type="option" checked={checked} onChange={onChange} />
      <DisplayBox data-testid="radioButton" checked={checked} onClick={onChange}>
        {checked ? <StyledSelector /> : null}
      </DisplayBox>

      <StyledLabel>{label}</StyledLabel>
    </StyledDiv>
  );
};
export default Radiobutton;
