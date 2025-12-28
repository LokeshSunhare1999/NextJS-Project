import React, { useState } from 'react';
import { styled } from 'styled-components';
import ICONS from '../../assets/icons';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  max-width: 90%;
  justify-content: start;
  align-items: center;
  margin-top: 20px;
`;

const P = styled.p`
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => props?.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
  text-decoration-line: ${(props) =>
    props?.$underline === 'true' ? 'underline' : ''};
  cursor: ${(props) => (props?.$pointer === 'true' ? 'pointer' : '')};
`;

const Span = styled.span`
  display: flex;
`;

const IntroVideo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  cursor: pointer;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const Description = ({ desc, courseIntroVideo }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {desc ? (
        <Wrapper>
          <P
            $color="#000000BF"
            $fontSize={'16px'}
            $fontWeight={'400'}
            $lineHeight={'normal'}
          >
            {isExpanded || desc?.length < 200
              ? desc
              : `${desc?.slice(0, 200)}...`}
            {desc?.length > 200 && (
              <Span onClick={toggleReadMore}>
                {isExpanded ? (
                  <P
                    $color="#000000"
                    $fontSize={'16px'}
                    $fontWeight={'600'}
                    $lineHeight={'normal'}
                    $underline={'true'}
                    $pointer={'true'}
                  >
                    {'Read Less'}
                  </P>
                ) : (
                  <P
                    $color="#000000"
                    $fontSize={'16px'}
                    $fontWeight={'600'}
                    $lineHeight={'normal'}
                    $underline={'true'}
                    $pointer={'true'}
                  >
                    {'Read More'}
                  </P>
                )}
              </Span>
            )}
          </P>
        </Wrapper>
      ) : null}
      {courseIntroVideo?.length > 0 ? (
        <IntroVideo>
          <Img
            src={ICONS.VIDEO_CAMERA_BLACK}
            alt="videoCameraBlack"
            width={'20px'}
            height={'20px'}
          />
          <P
            $color="#000000"
            $fontSize={'18px'}
            $fontWeight={'400'}
            $lineHeight={'normal'}
            $underline={'false'}
          >
            {'Intro Video'}
          </P>
        </IntroVideo>
      ) : null}
    </>
  );
};
Description.propTypes = {
  desc: PropTypes.string,
  courseIntroVideo: PropTypes.string,
};

export default Description;
