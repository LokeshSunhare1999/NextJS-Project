import React from 'react';
import TextField from '@mui/material/TextField';
import CustomCTA from './CustomCTA';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const SearchField = styled.div`
  width: 300px;
`;

const Search = ({ placeholder }) => {
  return (
    <Container>
      <SearchField>
        <TextField fullWidth label={placeholder} variant="filled" />
      </SearchField>
      <CustomCTA title={'Search'} />
    </Container>
  );
};
Search.PropTypes = {
  placeholder: PropTypes.string.isRequired,
};

export default Search;
