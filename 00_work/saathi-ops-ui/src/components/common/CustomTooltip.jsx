import React from 'react';
import { Tooltip, tooltipClasses } from '@mui/material';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CustomTooltip = styled(({ className, bgColor, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, bgColor }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: bgColor || '#000',
    width: '40px',
    height: '20px',
    top: '-10px !important',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: bgColor || '#000',
    padding: '8px 12px',
    maxWidth: '300px',
    marginLeft: '20px',
    left: '0px!important',
    fontFamily: 'Poppins',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
  },
}));
CustomTooltip.propTypes = {
  className: PropTypes.string,
  arrow: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default CustomTooltip;
