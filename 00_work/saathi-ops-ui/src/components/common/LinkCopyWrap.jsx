import React from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import ICONS from '../../assets/icons';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: ${({ width }) => width};
  overflow: hidden;
  height: 38px;
  gap: 10px;
`;

const LinkBox = styled.div`
  flex: 1;
  height: 38px;
  border-radius: 7px;
  background-color: ${({ bgColor }) => bgColor};
  overflow: hidden;
  font-size: 14px;
  color: #000;
  font-weight: 400;
`;

const CopyBtnWrap = styled.div`
  display: flex;
  border: 1px solid #3b2b8c;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;
const P = styled.p`
  color: #3b2b8c;
  font-size: 16px;
  font-weight: 400;
`;
const Img = styled.img`
  width: ${(props) => props?.$width};
  height: ${(props) => props?.$height};
`;
const Wrap = styled.p`
  padding: 5px;
`;

const LinkCopyWrap = ({ link, bgColor = '#F1F1F1', width = '350px' }) => {
  const trimmedLink = link?.length > 36 ? `${link?.slice(0, 33)}...` : link;

  const { enqueueSnackbar } = useSnackbar();

  const handleCopyClick = (e, item) => {
    e.stopPropagation();

    navigator.clipboard
      .writeText(item)
      .then(() => {
        enqueueSnackbar('Copied to clipboard', {
          variant: 'success',
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <Container width={width}>
      <LinkBox bgColor={bgColor}>
        <Wrap>{trimmedLink}</Wrap>
      </LinkBox>
      <CopyBtnWrap onClick={(e) => handleCopyClick(e, link)}>
        <P>Copy</P>
        <Img src={ICONS.COPY} alt="copy" $width="14px" $height="14px" />
      </CopyBtnWrap>
    </Container>
  );
};
export default LinkCopyWrap;
