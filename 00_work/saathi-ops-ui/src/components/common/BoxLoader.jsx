import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const AnimatedBox = styled(Box)`
  width: calc(100% - 55px);
`;

const BoxLoader = ({ size = 5 }) => {
  return (
    <AnimatedBox>
      {Array.from({ length: size }, (_, i) => i).map((item, idx) => {
        return (
          <Skeleton
            data-testid="skeleton-loader"
            animation="wave"
            height={70}
            key={idx}
          />
        );
      })}
    </AnimatedBox>
  );
};

BoxLoader.propTypes = {
  size: PropTypes.number,
};

export default BoxLoader;
