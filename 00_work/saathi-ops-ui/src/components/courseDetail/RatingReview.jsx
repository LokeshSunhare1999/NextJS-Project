import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import ICONS from '../../assets/icons';
import { Rating, Stack } from '@mui/material';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
`;

const ReviewDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimeDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DateDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const P = styled.p`
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => props?.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const RattingReview = ({ courseData }) => {
  const [ratingValue, setRatingValue] = useState(0);

  useEffect(() => {
    setRatingValue(courseData?.avgRating);
  }, [courseData?.avgRating]);

  const formattedDate = moment
    .tz(courseData?.updatedAt, 'UTC')
    .format('DD-MMM-YYYY, h:mm a');

  return (
    <Wrapper>
      <ReviewDiv>
        <P
          $color="#000000BF"
          $fontSize={'14px'}
          $fontWeight={'400'}
          $lineHeight={'normal'}
        >
          {courseData?.avgRating}
        </P>
        <Stack spacing={1} sx={{ marginTop: '-4px' }}>
          <Rating
            name="unique-rating"
            value={ratingValue}
            precision={0.5}
            readOnly
          />
        </Stack>
        <P
          $color="#000000BF"
          $fontSize={'14px'}
          $fontWeight={'400'}
          $lineHeight={'24px'}
        >
          ({courseData?.totalRatings} ratings)
        </P>
      </ReviewDiv>
      {courseData?.courseDurationString?.length > 0 ? (
        <TimeDiv>
          <Img src={ICONS.CLOCK} alt="clock" />
          <P
            $color="#586276"
            $fontSize={'14px'}
            $fontWeight={'400'}
            $lineHeight={'normal'}
          >
            {`${courseData?.courseDurationString}`}
          </P>
        </TimeDiv>
      ) : null}
      <DateDiv>
        <P
          $color="#586276"
          $fontSize={'14px'}
          $fontWeight={'400'}
          $lineHeight={'normal'}
        >
          {`Last Updated - ${formattedDate}`}
        </P>
      </DateDiv>
    </Wrapper>
  );
};
RattingReview.propTypes = {
  courseData: PropTypes.shape({
    avgRating: PropTypes.string,
    totalRatings: PropTypes.number,
    courseDuration: PropTypes.number,
    updatedAt: PropTypes.string,
  }),
};

export default RattingReview;
