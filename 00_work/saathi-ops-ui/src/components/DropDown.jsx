import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';

const DropDown = ({
  category,
  handleCategoryChange,
  menuItems,
  placeHolder = 'Select Category',
}) => {
  return (
    <FormControl
      fullWidth
      sx={{ border: 'none !important', marginTop: '10px' }}
    >
      <Select
        value={category}
        onChange={handleCategoryChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{
          borderRadius: '8px',
          border: 'none !important',
          outline: 'none',
          background: '#fff',
          fontFamily: 'Poppins',
          fontSize: '14px',
          lineHeight: '21px',
          fontWeight: '400',
          color: '#585858',
          height: '44px',
        }}
      >
        <MenuItem
          sx={{
            fontFamily: 'Poppins',
            fontSize: '14px',
            lineHeight: '21px',
            fontWeight: '400',
            color: '#585858',
          }}
          value=""
        >
          {placeHolder}
        </MenuItem>

        {menuItems.map((item) => {
          return (
            <MenuItem
              sx={{
                fontFamily: 'Poppins',
                fontSize: '14px',
                lineHeight: '21px',
                fontWeight: '400',
                color: '#585858',
              }}
              value={item}
              key={item}
            >
              {item}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
DropDown.propTypes = {
  category: PropTypes.string.isRequired,
  handleCategoryChange: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeHolder: PropTypes.string,
};

export default DropDown;
