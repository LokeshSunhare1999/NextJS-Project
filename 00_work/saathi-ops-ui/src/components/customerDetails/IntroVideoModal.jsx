import React from 'react';
import styled from 'styled-components';
import VideoPlayer from '../common/VideoPlayer';
import ShakaVideoPlayer from '../common/ShakaVideoPlayer';

const Wrapper = styled.div`
  padding: 20px;
`;
const P = styled.p`
  white-space: nowrap;
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => (props?.$fontSize ? props.$fontSize : '14px')};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
  margin-bottom: 20px;
`;

const FlexContainer = styled.div`
  font-family: Poppins;
  width: 100%;
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: 8px;
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;

const IntroVideoModal = ({
  videoLink,
  modalTitle = 'Intro Video',
  aspectRatio,
  isMpd = false,
}) => {

  return (
    <Wrapper>
      <P
        $color="#000"
        $fontSize="24px"
        $fontWeight={'600'}
        $lineHeight={'normal'}
      >
        {modalTitle}
      </P>
      <FlexContainer $alignItems="center" $justifyContent="center">
        {isMpd ? (
          <ShakaVideoPlayer aspectRatio={aspectRatio} videoLink={videoLink} />
        ) : (
          <VideoPlayer aspectRatio={aspectRatio} videoLink={videoLink} />
        )}
      </FlexContainer>
    </Wrapper>
  );
};

export default IntroVideoModal;
