import React, { useRef } from 'react';
import './../App.css';
import styled from 'styled-components';
import * as palette from '../style';
import ICONS from '../assets/icons';
import { CircularProgress } from '@mui/material';
import usePermission from '../hooks/usePermission';
import PropTypes from 'prop-types';

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props?.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: normal;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
const PrimaryCTA = styled.button`
  display: flex;
  padding: ${(props) => props?.$padding ?? '10px 16px'};
  align-items: center;
  gap: ${(props) => props.$gap};
  border-radius: 10px;
  border: ${(props) => props.$border};
  background: ${(props) =>
    props.disabled ? props?.$disabledBgColor : props.$bgColor};
  justify-content: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => props?.$opacity ?? 1};
  width: ${(props) => props?.$buttonWidth ?? 'auto'};
`;

const StyledInput = styled.input`
  display: none;
`;

const CustomCTA = ({
  type = 'button',
  title,
  onClick,
  showIcon = false,
  color,
  bgColor,
  border,
  isPermitted = true,
  fontSize = palette.FONTSIZE_16,
  fontWeight = '400',
  url = ICONS.PLUS,
  disabled = false,
  width = '14px',
  height = '14px',
  gap = '16px',
  isInput = false,
  acceptType,
  handleInputChange,
  isLoading = false,
  loadingColor = '#ffffff',
  opacity = 1,
  buttonWidth = 'auto',
  padding = '10px 16px',
  disabledBgColor = '#CDD4DF',
}) => {
  const hiddenFileInput = useRef(null);

  const handleInputBtnClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleClick = () => {
    if (!isInput) {
      onClick && onClick();
    } else {
      handleInputBtnClick();
    }
  };
  if (!isPermitted) {
    return null;
  }
  return (
    <PrimaryCTA
      type={type}
      disabled={disabled || isLoading}
      onClick={handleClick}
      $bgColor={bgColor}
      $border={border}
      $gap={gap}
      $opacity={opacity}
      $buttonWidth={buttonWidth}
      $padding={padding}
      $disabledBgColor={disabledBgColor}
    >
      {isLoading ? (
        <CircularProgress sx={{ color: loadingColor }} size={24} />
      ) : (
        <>
          {showIcon && (
            <Img src={url} alt="icon" width={width} height={height} />
          )}
          <P $color={color} $fontSize={fontSize} $fontWeight={fontWeight}>
            {title}
          </P>
          <StyledInput
            type="file"
            onChange={(e) => handleInputChange(e)}
            ref={hiddenFileInput}
            accept={acceptType}
          />
        </>
      )}
    </PrimaryCTA>
  );
};
CustomCTA.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  showIcon: PropTypes.bool,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  border: PropTypes.string,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  url: PropTypes.string,
  disabled: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  gap: PropTypes.string,
  isInput: PropTypes.bool,
  acceptType: PropTypes.string,
  handleInputChange: PropTypes.func,
  isLoading: PropTypes.bool,
  loadingColor: PropTypes.string,
  opacity: PropTypes.number,
};

export default CustomCTA;
