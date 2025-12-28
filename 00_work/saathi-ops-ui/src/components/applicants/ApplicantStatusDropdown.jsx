import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import DropDownMenu from '../DropDownMenu';
import PropTypes from 'prop-types';
import {
  APPLICANT_STATUS_CURRENT_STATES,
  APPLICATION_STATUS_MAP,
} from '../../constants/jobs';
import { VERIFICATION_STATUS_MAP } from '../../constants/verification';
import { findKeyByValue } from '../../utils/helper';

const CategoryWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  opacity: 1;
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
  background: ${(props) => (props?.$bgColor ? props.$bgColor : '#ffffff')};
  color: ${(props) => (props?.$color ? props.$color : '#000000')};
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

const ApplicantStatusDropdown = ({
  isBoxShadow,
  top,
  marginTop,
  isScrollable,
  border,
  status,
  handleStatusSelect,
  statusOpen,
  setStatusOpen,
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
    if (!status) {
      setInputValue('Choose Status');
      return;
    }
    setInputValue(displayConvertFn(status) ? displayConvertFn(status) : status);
  }, [status]);

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
    setStatusOpen(true);
  };

  const statusEnum = findKeyByValue(APPLICANT_STATUS_CURRENT_STATES, status);
  return (
    <>
      <CategoryWrapper $disabled={disabled}>
        <CategoryBox
          $isError={isError}
          $isBoxShadow={isBoxShadow}
          $marginTop={marginTop}
          $border={`1px solid ${APPLICATION_STATUS_MAP[statusEnum]?.color}`}
          $bgColor={APPLICATION_STATUS_MAP[statusEnum]?.color}
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
              $color={statusEnum ? '#fff' : '#000'}
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
            >
              {inputValue}
            </P>
          )}
          {!disabled ? (
            <Img
              src={
                statusOpen
                  ? statusEnum
                    ? ICONS.ARROW_UP_WHITE
                    : ICONS.ARROW_UP
                  : statusEnum
                    ? ICONS.ARROW_DOWN_WHITE
                    : ICONS.ARROW_DOWN
              }
              alt="arrowDown"
              width={'14px'}
              height={'14px'}
            />
          ) : null}
        </CategoryBox>

        {statusOpen && (
          <DropDownMenu
            isBoxShadow={isBoxShadow}
            isScrollable={isScrollable}
            top={top}
            border={border}
            handleCategorySelect={handleStatusSelect}
            categoryOpen={statusOpen}
            setCategoryOPen={setStatusOpen}
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
ApplicantStatusDropdown.propTypes = {
  isBoxShadow: PropTypes.bool,
  top: PropTypes.string,
  marginTop: PropTypes.string,
  isScrollable: PropTypes.bool,
  border: PropTypes.string,
  status: PropTypes.string.isRequired,
  handleStatusSelect: PropTypes.func.isRequired,
  statusOpen: PropTypes.bool.isRequired,
  setStatusOpen: PropTypes.func.isRequired,
  listItem: PropTypes.arrayOf(PropTypes.string),
  errorMessage: PropTypes.string,
  isError: PropTypes.bool,
  displayConvertFn: PropTypes.func,
  isSearchable: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ApplicantStatusDropdown;
