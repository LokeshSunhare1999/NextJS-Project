import React, { useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import ActionButton from '../ActionButton';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props?.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
`;

const Right = styled.div`
  display: flex;
  width: 16px;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const ActionWrapper = styled.div`
  display: inline-flex;
  width: 160px;
  padding: 5px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.12);
  position: absolute;
  top: 30px;
  right: 0px;
  z-index: ${zIndexValues.PAGE_HEADER}:;
`;

const BtnDiv = styled.div`
  display: flex;
  padding: 8px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Hr = styled.div`
  width: 100%;
  height: 1px;
  background: #cdd4df;
`;

const PageHeader = ({
  heading,
  subHeading,
  arrBtn,
  showActionsPanel = true,
}) => {
  const [actionOpen, setActionOpen] = useState(false);
  return (
    <Wrapper>
      <Left>
        <P $fontSize={'28px'} $fontWeight={'600'} $lineHeight={'35px'}>
          {heading}
        </P>
        <P $fontSize={'18px'} $fontWeight={'400'} $lineHeight={'normal'}>
          {subHeading}
        </P>
      </Left>
      <Right>
        {showActionsPanel ? (
          <Img
            src={ICONS.THREE_DOTS}
            alt="three-dots"
            onClick={() => setActionOpen(!actionOpen)}
          />
        ) : null}

        {actionOpen && (
          <ActionButton arrBtn={arrBtn} setActionOpen={setActionOpen} />
        )}
      </Right>
    </Wrapper>
  );
};
PageHeader.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  arrBtn: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
};
export default PageHeader;
