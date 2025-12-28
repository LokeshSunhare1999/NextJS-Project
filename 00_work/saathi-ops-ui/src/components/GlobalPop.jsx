import React from 'react';
import styled from 'styled-components';
import { zIndexValues } from '../style';
import ICONS from '../assets/icons';
import { ClickAwayListener } from '@mui/material';
import CustomCTA from './CustomCTA';
import PropTypes from 'prop-types';

const DeletePopWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  width: calc(100%);
  height: calc(100%);
  //   opacity: 0.3;
  background: #0008;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: ${zIndexValues.COURSE_DELETE_POP};
`;

const PopBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  margin-top: 70px;
  padding: 2px 0px 0px 0px;
  width: 478px;
  height: 205px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff;
  opacity: 10000;
`;

const TopBoxWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 474px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 10px 10px 0px 0px;
  background: #f4f6fa;
`;

const TopBox = styled.div`
  display: flex;
  width: 438px;
  justify-content: space-between;
  align-items: center;
`;

const DescriptionBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Description = styled.div`
  display: flex;
  margin-top: 28px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const ActionBox = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const GlobalPop = ({
  setOpenDeletePop,
  title,
  heading,
  subHeading,
  handleDelete,
  btnTitle = 'Delete',
  btnBgColor = '#F31919',
}) => {
  const handleClickAway = () => {
    setOpenDeletePop(false);
  };
  return (
    <DeletePopWrap>
      <ClickAwayListener onClickAway={handleClickAway}>
        <PopBox>
          {/* top */}
          <TopBoxWrap>
            <TopBox>
              <P
                $color={'#000'}
                $fontSize={'18px'}
                $fontWeight={'600'}
                $lineHeight={'normal'}
              >
                {title}
              </P>
              <Img
                src={ICONS.CROSS_ICON}
                alt="plus"
                width="20px"
                height="20px"
                onClick={handleClickAway}
              />
            </TopBox>
          </TopBoxWrap>
          {/* middle */}
          <DescriptionBox>
            <Description>
              <P
                $color={'#000'}
                $fontSize={'18px'}
                $fontWeight={'600'}
                $lineHeight={'35px'}
              >
                {heading}
              </P>
              <P
                $color={'#000'}
                $fontSize={'14px'}
                $fontWeight={'400'}
                $lineHeight={'normal'}
              >
                {subHeading}
              </P>
            </Description>
          </DescriptionBox>
          {/* bottm */}
          <DescriptionBox>
            <ActionBox>
              <CustomCTA
                onClick={handleClickAway}
                title={'Cancel'}
                showSecondary={true}
                color={'#586275'}
                bgColor={'#FFF'}
                border={'1px solid #CDD4DF'}
              />
              <CustomCTA
                onClick={handleDelete}
                title={btnTitle}
                showSecondary={true}
                color={'#FFF'}
                bgColor={btnBgColor}
                border={'1px solid #CDD4DF'}
              />
            </ActionBox>
          </DescriptionBox>
        </PopBox>
      </ClickAwayListener>
    </DeletePopWrap>
  );
};
GlobalPop.propTypes = {
  setOpenDeletePop: PropTypes.func.isRequired,
  title: PropTypes.string,
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  handleDelete: PropTypes.func.isRequired,
};

export default GlobalPop;
