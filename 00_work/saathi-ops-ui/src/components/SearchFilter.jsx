import React, { useState } from 'react';
import { styled } from 'styled-components';
import ICONS from '../assets/icons';
import DropDownCategory from './DropDownCategory';
import PropTypes from 'prop-types';

const SearchWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  // margin-bottom: 20px;
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;
const SearchBox = styled.div`
  display: flex;
  // width: 309px;
  padding: 10px 20px;
  align-items: center;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid #cdd4df;
  background: #fff;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const Input = styled.input`
  width: ${(props) => props.width};
  border: none;
  outline: none;
  color: #000;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const P = styled.p`
  color: #585858;
  font-family: Poppins;
  font-size: ${(props) => props.fontSize};
  font-style: normal;
  font-weight: ${(props) => props.fontWeight};
  line-height: ${(props) => props.lineHeight};
`;

const SearchFilter = ({
  isFilter = false,
  searchArr,
  listItem,
  category,
  setCategory,
  title,
  onKeyPress = () => {},
  showIcon = true,
  isScrollable,
}) => {
  const [categoryOpen, setCategoryOPen] = useState(false);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setCategoryOPen(!categoryOpen);
  };

  const handleInputChange = (setInput) => (event) => {
    setInput(event.target.value);
  };

  return (
    <SearchWrapper>
      <SearchWrap>
        {searchArr?.map((search) => {
          return (
            <SearchBox key={search.id}>
              {showIcon ? (
                <Img
                  src={ICONS.SEARCH_ICON}
                  alt="search"
                  width={'20px'}
                  height={'20px'}
                />
              ) : null}
              <Input
                placeholder={search.placeHolder}
                value={search.enteredInput}
                onChange={handleInputChange(search.setInput)}
                width={search?.width}
                onKeyDown={onKeyPress}
              />
            </SearchBox>
          );
        })}
      </SearchWrap>

      {isFilter && (
        <DropDownCategory
          isBoxShadow={false}
          top={'44px'}
          marginTop={'0px'}
          border={'1px solid #cdd4df'}
          category={category || title}
          handleCategorySelect={handleCategorySelect}
          categoryOpen={categoryOpen}
          setCategoryOPen={setCategoryOPen}
          listItem={listItem}
          isScrollable={isScrollable}
        />
      )}
    </SearchWrapper>
  );
};

SearchFilter.propTypes = {
  isFilter: PropTypes.bool,
  searchArr: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      placeHolder: PropTypes.string,
      enteredInput: PropTypes.string,
      setInput: PropTypes.func.isRequired,
      width: PropTypes.string,
    }),
  ).isRequired,
  listItem: PropTypes.arrayOf(PropTypes.string),
  category: PropTypes.string,
  setCategory: PropTypes.func,
  title: PropTypes.string,
  onKeyPress: PropTypes.func,
};

export default SearchFilter;
