import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../../assets/icons';
import { Pagination as PaginationCom } from 'antd';
import { COURSE_MODULE } from '../../../constants';
import { ClickAwayListener } from '@mui/material';
import styleComponents from '../../../style/pageStyle';
import PropTypes from 'prop-types';
import { generateSearchParams } from '../../../utils/helper';

const { PaginationWrap } = styleComponents();

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.$isFlexColumn ? 'column' : 'row')};
  justify-content: ${(props) =>
    props.$isFlexColumn ? 'start' : 'space-between'};
  align-items: ${(props) => (props.$isFlexColumn ? 'end' : 'center')};
  // gap: 8px;
`;

const Left = styled.div`
  display: flex;
  height: 30px;
  justify-content: center;
  align-items: center;
`;
const Right = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;
const PaginationInfo = styled.div`
  color: #8899a8;
  text-align: center;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
`;

const ArrowButton = styled.button`
  display: flex;
  height: 32px;
  min-width: 32px;
  padding: 0px 7px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background: ${(props) => props.$arrowBg};
  border: none;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Img = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const StyledPagination = styled(PaginationCom)`
  .ant-pagination-item {
    background-color: ${(props) => props.$itemBg || 'white'};
    font-size: ${(props) => props.$fontSize || '14px'};
    color: ${(props) => props.$colorText || '#000'};
    border: none;
  }

  .ant-pagination-options > div > div {
    cursor: pointer !important;
  }

  .ant-pagination-item-active {
    background-color: ${(props) => props.$itemActiveBg || '#141482'};
    color: ${(props) => props.$colorActiveText || '#fff'};
    border: none;
  }

  .ant-pagination-item a {
    color: inherit;
  }

  .ant-pagination-item-active a {
    color: inherit;
  }
`;

const CustomSelectWrapper = styled.div`
  display: flex;
  max-width: fit-content;
  padding: 3px 8px;
  align-items: center;
  gap: 10px;
  border-radius: 6px;
  border: ${(props) =>
    props.$openDropdown ? '1px solid #141482' : '1px solid #dfe4ea'};
  background: #fff;
  position: relative;
  cursor: pointer;
`;

const CustomSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DropDownWrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #dfe4ea;
  background: #fff;
  position: absolute;
  top: ${(props) => (props.$isBottom ? '' : '32px')};
  bottom: ${(props) => (props.$isBottom ? '32px' : '')};
  right: 0px;
  z-index: 10;
`;

const Span = styled.span`
  display: flex;
  padding: 3px 8px;
`;

const Pagination = ({
  onShowSizeChange,
  currentPage,
  setCurrentPage,
  totalItems,
  setTotalItems,
  itemsPerPage,
  setItemsPerPage,
  arrowBg,
  isFlexColumn = false,
  isBottom = false,
  setOpenDropdown,
  openDropdown,
  handleDropdown,
  isBackground = true,
  searchParams,
  navigate,
  pageType,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return (
        <ArrowButton $arrowBg={arrowBg}>
          <Img
            src={ICONS.PREV_LEFT}
            alt="prev"
            $width={'18px'}
            $height={'18px'}
            $disabled={currentPage === 1}
          />
        </ArrowButton>
      );
    }
    if (type === 'next') {
      return (
        <ArrowButton $arrowBg={arrowBg}>
          <Img
            src={ICONS.NEXT_RIGHT}
            alt="next"
            $width={'18px'}
            $height={'18px'}
            $disabled={currentPage === totalPages}
          />
        </ArrowButton>
      );
    }
    return originalElement;
  };

  const handlePaginate = (page) => {
    if (currentPage !== page) {
      setCurrentPage(page);
      searchParams.set('currentPage', page);
      const queryString = generateSearchParams(searchParams);

      navigate(`/${pageType}?${queryString}`, { replace: true });
    }
  };

  const handleClickAway = (event) => {
    event.stopPropagation();
    setOpenDropdown(false);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      {totalItems ? (
        <PaginationWrap $isBackground={isBackground}>
          <PaginationContainer $isFlexColumn={isFlexColumn}>
            <Left>
              <PaginationInfo>
                {startItem}-{endItem} of {totalItems}
              </PaginationInfo>
            </Left>
            <Right>
              <StyledPagination
                showSizeChanger={false}
                showLessItems={true}
                current={currentPage}
                total={totalItems}
                pageSize={itemsPerPage}
                itemRender={itemRender}
                onChange={handlePaginate}
                $itemBg="#fff"
                $itemActiveBg={'#141482'}
                $itemHoverBg="#141482"
                $colorText="#4E5D78"
                $colorActiveText="#FFF"
                $fontSize={40}
              />
              <ClickAwayListener
                onClickAway={(event) => handleClickAway(event)}
              >
                <CustomSelectWrapper
                  $openDropdown={openDropdown}
                  onClick={() => handleDropdown()}
                >
                  <CustomSelect>
                    <P
                      $color={'#637381'}
                      $fontSize={'14px'}
                      $fontWeight={'400'}
                      $lineHeight={'22px'}
                    >
                      {itemsPerPage}
                    </P>
                    <Img
                      src={
                        openDropdown
                          ? ICONS.ARROW_UP_LIGHT
                          : ICONS.ARROW_DOWN_LIGHT
                      }
                      alt="down"
                      $width={'16px'}
                      $height={'16px'}
                    />
                  </CustomSelect>
                  {openDropdown && (
                    <DropDownWrap $isBottom={isBottom}>
                      {COURSE_MODULE?.PAGE_SIZE_OPTIUONS.map((size, index) => (
                        <Span
                          key={index}
                          onClick={() => onShowSizeChange(size)}
                        >
                          <P
                            $color={'#637381'}
                            $fontSize={'14px'}
                            $fontWeight={'400'}
                            $lineHeight={'22px'}
                          >
                            {size}
                          </P>
                        </Span>
                      ))}
                    </DropDownWrap>
                  )}
                </CustomSelectWrapper>
              </ClickAwayListener>
            </Right>
          </PaginationContainer>
        </PaginationWrap>
      ) : null}
    </>
  );
};
Pagination.propTypes = {
  onShowSizeChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  totalItems: PropTypes.number,
  setTotalItems: PropTypes.func,
  itemsPerPage: PropTypes.number,
  setItemsPerPage: PropTypes.func,
  arrowBg: PropTypes.string,
  isFlexColumn: PropTypes.bool,
  isBottom: PropTypes.bool,
  setOpenDropdown: PropTypes.func,
  openDropdown: PropTypes.bool,
  handleDropdown: PropTypes.func,
  isBackground: PropTypes.bool,
};

export default Pagination;
