import React from 'react';
import styled from 'styled-components';
import { RUPEE_SYMBOL } from '../../constants/details';
import ICONS from '../../assets/icons';
import CustomTooltip from './CustomTooltip';

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

const InfoBlock = ({ item, tooltipIcon, showTooltip, statusRemark }) => {
  const createTooltip = (statusRemark) => {
    return (
      <StyledDiv
        $flexDirection={'column'}
        $alignItems={'flex-start'}
        $width={'180px'}
        $gap={'0px'}
      >
        <StyledDiv
          $fontSize={'14px'}
          $lineHeight={'20px'}
          $fontWeight={'600'}
          $margin={'0 0 7px 0'}
        >
          Amount Breakup
        </StyledDiv>

        <StyledDiv
          $justifyContent={'space-between'}
          $width={'calc(100% - 8px)'}
          $border={'1px solid'}
          $height={'24px'}
          $padding={'0 4px'}
        >
          <StyledDiv>{'Requested Amount'}</StyledDiv>
          <StyledDiv $alignItems={'flex-end'} $fontWeight={'700'}>
            {RUPEE_SYMBOL} {statusRemark?.grossAmount}
          </StyledDiv>
        </StyledDiv>
        <StyledDiv
          $justifyContent={'space-between'}
          $width={'calc(100% - 8px)'}
          $border={'1px solid'}
          $height={'24px'}
          $padding={'0 4px'}
        >
          <StyledDiv>
            {`Processing Charge (${statusRemark?.processingCharge}%)`}
          </StyledDiv>
          <StyledDiv $alignItems={'flex-end'} $fontWeight={'700'}>
            -{RUPEE_SYMBOL} {statusRemark?.processingAmount}
          </StyledDiv>
        </StyledDiv>
        <StyledDiv
          $justifyContent={'space-between'}
          $width={'calc(100% - 8px)'}
          $border={'1px solid'}
          $height={'24px'}
          $padding={'0 4px'}
        >
          <StyledDiv>{`TDS (${statusRemark?.tdsCharge}%)`}</StyledDiv>
          <StyledDiv $alignItems={'flex-end'} $fontWeight={'700'}>
            -{RUPEE_SYMBOL} {statusRemark?.tdsAmount}
          </StyledDiv>
        </StyledDiv>
        <StyledDiv
          $justifyContent={'space-between'}
          $width={'calc(100% - 8px)'}
          $border={'1px solid'}
          $height={'24px'}
          $padding={'0 4px'}
          $backgroundColor={'#282828'}
        >
          <StyledDiv $color={'#fff'}>{`Credit Amount`}</StyledDiv>
          <StyledDiv
            $alignItems={'flex-end'}
            $fontWeight={'700'}
            $color={'#fff'}
          >
            {RUPEE_SYMBOL} {statusRemark?.netAmount}
          </StyledDiv>
        </StyledDiv>
      </StyledDiv>
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
          bgColor={'#EBEBEB'}
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

export default InfoBlock;
