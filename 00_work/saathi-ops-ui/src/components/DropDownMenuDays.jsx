import { ClickAwayListener } from '@mui/material';
import React, { Fragment } from 'react';
import { styled } from 'styled-components';
import { zIndexValues } from '../style';
import PropTypes from 'prop-types';

const DropDownWrapper = styled.div`
  display: flex;
  width: 100%;
  position: absolute;
  top: ${(props) => props.$top};
  left: 0px;
  z-index: ${zIndexValues.DROP_DOWN_MENU};
`;

const DropDownBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${(props) => (props.$isScrollable ? '300px' : 'auto')};
  overflow-y: ${(props) => (props.$isScrollable ? 'scroll' : 'auto')};
  border-radius: 8px;
  border: ${(props) => props.$border};
  background: transparent;
`;

const P = styled.p`
  color: #fff;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const DropDownItem = styled.div`
  display: flex;
  // width: 100%;
  padding: 12px 20px;
  cursor: pointer;
  align-self: center;
  &:hover {
    background-color: #cdd4df80;
    border-radius: ${(props) => props.$borderRadius};
  }
`;

const Hr = styled.div`
  width: 100%;
  height: 1px;
  background: #cdd4df;
`;

const DropDownMenuDays = ({
  isBoxShadow,
  top,
  border,
  isScrollable = false,
  handleCategorySelect,
  categoryOpen,
  setCategoryOPen,
  listItem,
  displayConvertFn = (item) => item,
}) => {
  const handleClickAway = (event) => {
    // event.stopPropagation();
    setCategoryOPen(!categoryOpen);
  };

  return (
    <ClickAwayListener onClickAway={(event) => handleClickAway(event)}>
      <DropDownWrapper $top={top}>
        <DropDownBox
          $isBoxShadow={isBoxShadow}
          $border={border}
          $isScrollable={isScrollable}
        >
          {listItem?.map((item, index) => {
            return (
              <Fragment key={index}>
                <DropDownItem
                  onClick={() => handleCategorySelect(item)}
                  $borderRadius={
                    index === 0
                      ? '8px 8px 0px 0px'
                      : index + 1 === listItem?.length
                        ? '0px 0px 8px 8px'
                        : '0px'
                  }
                >
                  <P
                    $fontSize={'24px'}
                    $fontWeight={'300'}
                    $lineHeight={'normal'}
                  >
                    {displayConvertFn(item)}
                  </P>
                </DropDownItem>
              </Fragment>
            );
          })}
        </DropDownBox>
      </DropDownWrapper>
    </ClickAwayListener>
  );
};
DropDownMenuDays.propTypes = {
  isBoxShadow: PropTypes.bool,
  top: PropTypes.string,
  border: PropTypes.string,
  isScrollable: PropTypes.bool,
  handleCategorySelect: PropTypes.func.isRequired,
  categoryOpen: PropTypes.bool.isRequired,
  setCategoryOPen: PropTypes.func.isRequired,
  listItem: PropTypes.arrayOf(PropTypes.string).isRequired,
  displayConvertFn: PropTypes.func,
};

export default DropDownMenuDays;
