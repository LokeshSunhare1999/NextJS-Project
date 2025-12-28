import styled from 'styled-components';
import { RUPEE_SYMBOL } from '../../constants/details';
import CustomTooltip from './CustomTooltip';
import React from 'react';

const StyledDiv = styled.div`
  display: ${(props) => props.$display || 'flex'};
  flex-direction: ${(props) => props.$flexDirection || 'row'};
  width: ${(props) => props.$width || 'auto'};
  align-items: ${(props) => props.$alignItems || 'center'};
  justify-content: ${(props) => props.$justifyContent || 'center'};
  gap: ${(props) => props.$gap || '10px'};
  background-color: ${(props) => props.$backgroundColor || 'transparent'};
  color: ${(props) => props.$color || '#000'};
  font-size: ${(props) => props.$fontSize || '10px'};
  font-weight: ${(props) => props.$fontWeight || '500'};
  line-height: ${(props) => props.$lineHeight || '14px'};
  border: ${(props) => props.$border || 'none'};
  margin: ${(props) => props.$margin || '0px'};
  padding: ${(props) => props.$padding || '0px'};
  height: ${(props) => props.$height || 'auto'};
`;

const StyledImg = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
`;

const StyledUl = styled.ul`
  list-style-type: ${(props) =>
    props.$listStyleType ? props.$listStyleType : 'none'};
`;

const StyledOl = styled.ol`
  padding: ${(props) => (props.$padding ? props.$padding : '0 0 0 0px')};
`;

const ReferralAmountInfo = ({ item, tooltipIcon, showTooltip, statusRemark = [] }) => {

  const createTooltip = (statusRemark) => {
    return (
      <StyledUl>
        {statusRemark?.length > 0 ? (
          statusRemark.map((remark, index) => (
            <StyledOl key={index}>{remark}</StyledOl>
          ))
        ) : null}
      </StyledUl>
    );
  };

  return (
    <StyledDiv
      $color={'#606C85'}
      $fontWeight={'400'}
      $fontSize={'14px'}
      $lineHeight={'20px'}
    >
      {`${RUPEE_SYMBOL} ${item}`}{' '}
      {showTooltip ? (
        <CustomTooltip
          placement="right-end"
          title={createTooltip(statusRemark)}
        >
          <StyledImg
            src={tooltipIcon}
            alt="Tooltip"
            $width="16px"
            $height="16px"
          />
        </CustomTooltip>
      ) : null}
    </StyledDiv>
  );
};

export default ReferralAmountInfo;
