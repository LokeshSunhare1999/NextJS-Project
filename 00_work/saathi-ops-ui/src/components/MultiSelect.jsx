import React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';

const MultiSelect = ({
  optionsList,
  selectedOptions,
  handleChange,
  required = false,
}) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name, selectedOptions, theme) {
    return {
      fontWeight:
        selectedOptions.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const theme = useTheme();

  return (
    <FormControl required={required} fullWidth>
      <InputLabel>Permissions</InputLabel>
      <Select
        labelId="demo-multiple-name-label"
        multiple
        value={selectedOptions}
        onChange={handleChange}
        input={<OutlinedInput label="Permissions" />}
        MenuProps={MenuProps}
      >
        {optionsList.map((val) => (
          <MenuItem
            key={val}
            value={val}
            style={getStyles(val, selectedOptions, theme)}
          >
            {val}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
MultiSelect.propTypes = {
  optionsList: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default MultiSelect;
