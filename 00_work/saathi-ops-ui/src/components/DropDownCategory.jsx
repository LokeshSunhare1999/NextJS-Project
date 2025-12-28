import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import DropDownMenu from './DropDownMenu';
import PropTypes from 'prop-types';

const CategoryWrapper = styled.div`
  display: flex;
  min-width: 200px;
  position: relative;
  opacity: ${(props) => (props?.$disabled ? '0.5' : '1')};
`;

const CategoryBox = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  padding: 10px 20px;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  border: ${(props) => props.$border};
  background: #fff;
  cursor: ${(props) => (props?.$disabled ? 'not-allowed' : 'pointer')};
  margin-top: ${(props) => props.$marginTop};
  box-shadow: ${(props) =>
    props.$isBoxShadow ? '0px 0px 1px 0px rgba(0, 0, 0, 0.25)' : ''};
  border: ${(props) => (props.$isError ? '1px solid red' : '')};
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const ErrorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const StyledInput = styled.input`
  width: ${(props) => props.$width};
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  border: none;
  outline: none;
`;

const DropDownCategory = ({
  isBoxShadow,
  top,
  marginTop,
  isScrollable,
  border,
  category,
  courseTitle,
  handleCategorySelect,
  categoryOpen,
  setCategoryOPen,
  listItem,
  errorMessage,
  isError,
  displayConvertFn = (item) => item,
  isSearchable = false,
  placeholder = '',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [searchedListedItems, setSearchedListedItems] = useState([]);

  useEffect(() => {
    setSearchedListedItems(searchItems(listItem, inputValue));
  }, []);

  useEffect(() => {
    setInputValue(
      displayConvertFn(category) ? displayConvertFn(category) : category,
    );
  }, [category]);

  const searchItems = (items, searchString) => {
    const filterlist = items?.filter((item) => {
      const convertedItem = displayConvertFn(item)
        ? displayConvertFn(item)
        : item;
      return convertedItem?.toLowerCase().includes(searchString.toLowerCase());
    });
    return filterlist;
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSearchedListedItems(searchItems(listItem, e.target.value));
  };

  const handleFilterBox = (event) => {
    if (disabled) return;
    setCategoryOPen(true);
  };
  return (
    <>
      <CategoryWrapper $disabled={disabled}>
        <CategoryBox
          $isError={isError}
          $isBoxShadow={isBoxShadow}
          $marginTop={marginTop}
          $border={border}
          $disabled={disabled}
          onClick={(event) => handleFilterBox(event)}
        >
          {isSearchable ? (
            <StyledInput
              $width={'100%'}
              $color={'#585858'}
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
              value={inputValue}
              placeholder={placeholder}
              onChange={handleInputChange}
            />
          ) : (
            <P
              $color={'#585858'}
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
            >
              {inputValue}
            </P>
          )}
          <Img
            src={categoryOpen ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}
            alt="arrowDown"
            width={'14px'}
            height={'14px'}
          />
        </CategoryBox>

        {categoryOpen && (
          <DropDownMenu
            isBoxShadow={isBoxShadow}
            isScrollable={isScrollable}
            top={top}
            border={border}
            handleCategorySelect={handleCategorySelect}
            categoryOpen={categoryOpen}
            setCategoryOPen={setCategoryOPen}
            listItem={isSearchable ? searchedListedItems : listItem}
            displayConvertFn={displayConvertFn}
          />
        )}
      </CategoryWrapper>
      {isError && (
        <ErrorBox>
          <P
            $color={'red'}
            $fontSize={'14px'}
            $fontWeight={'300'}
            $lineHeight={'normal'}
          >
            {errorMessage}
          </P>
        </ErrorBox>
      )}
    </>
  );
};
DropDownCategory.propTypes = {
  isBoxShadow: PropTypes.bool,
  top: PropTypes.string,
  marginTop: PropTypes.string,
  isScrollable: PropTypes.bool,
  border: PropTypes.string,
  category: PropTypes.string.isRequired,
  courseTitle: PropTypes.string,
  handleCategorySelect: PropTypes.func.isRequired,
  categoryOpen: PropTypes.bool.isRequired,
  setCategoryOPen: PropTypes.func.isRequired,
  listItem: PropTypes.arrayOf(PropTypes.string),
  errorMessage: PropTypes.string,
  isError: PropTypes.bool,
  displayConvertFn: PropTypes.func,
  isSearchable: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default DropDownCategory;
