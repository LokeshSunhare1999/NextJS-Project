import React from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import PropTypes from 'prop-types';

const StyledCheckbox = styled.input`
  display: none;
  width: 14px;
  height: 14px;
  border: ${(props) =>
    props?.checked ? '1px solid #141482' : '1px solid #CDD4DF'};
  cursor: pointer;
  color: #141482 !important;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`;

const StyledLabel = styled.label`
  margin: 0 0 0 25px;
  font-family: Poppins;
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  color: #586276;
`;

const StyledDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 11px;
`;

const DisplayBox = styled.div`
  position: absolute;
  top: -1px;
  left: 0;
  width: 14px;
  height: 14px;
  background-color: #fff;
  border-radius: 2px;
  border: ${(props) =>
    props?.checked ? '1px solid #141482' : '1px solid #CDD4DF'};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledTick = styled.img`
  width: 12px;
  height: auto;
`;

const Checkbox = ({ label, checked = false, onChange }) => {
  return (
    <StyledDiv>
      <StyledCheckbox
        data-testid="custom-checkbox"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <DisplayBox checked={checked} onClick={onChange}>
        {checked ? <StyledTick src={ICONS.BLUE_TICK} alt="check" /> : null}
      </DisplayBox>

      <StyledLabel>{label}</StyledLabel>
    </StyledDiv>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Checkbox;
