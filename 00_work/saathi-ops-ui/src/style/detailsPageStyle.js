import styled from 'styled-components';
import { Box } from '@mui/material';
import { DEVICE_TYPES } from '../constants';

const detailsPageStyle = () => {
  const Wrapper = styled.div`
    margin: ${(props) =>
      props?.$deviceType === DEVICE_TYPES?.MOBILE
        ? '61px 0 0 0px'
        : '61px 0 0 265px'};
    // width: calc(100% - 300px);
    min-height: calc(100vh - 3.5rem);
    background-color: #f4f6fa;
    padding: 16px 40px;
    font-family: 'Poppins', sans-serif;
  `;

  const Header = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `;

  const Left = styled.div`
    display: inline-flex;
    padding: 10px;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
  `;

  const Img = styled.img`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    cursor: pointer;
  `;

  const AnimatedBox = styled(Box)`
    width: calc(100% - 55px);
  `;

  const StyledDiv = styled.div`
    position: relative;
    height: ${(props) => props.$height ?? 'auto'};
    width: ${(props) => props.$width ?? '100%'};
    margin: ${(props) => props.$margin ?? null};
    padding: ${(props) => props.$padding ?? null};
    border: ${(props) => props.$border ?? null};
    border-radius: ${(props) => props.$borderRadius ?? null};
    background: ${(props) => props.$background ?? null};
    display: ${(props) => props.$display ?? 'flex'};
    flex-direction: ${(props) => props.$flexDirection ?? 'column'};
    align-items: ${(props) => props.$alignItems ?? 'center'};
    justify-content: ${(props) => props.$justifyContent ?? 'center'};
    font-family: Poppins;
    font-size: ${(props) => props.$fontSize ?? '14px'};
    font-weight: ${(props) => props.$fontWeight ?? '400'};
    color: ${(props) => props.$color ?? '#000'};
    line-height: ${(props) => props.$lineHeight ?? '21px'};
    gap: ${(props) => props.$gap ?? '0'};
  `;

  const StyledSpan = styled.span`
    color: ${(props) => props?.$color};
    font-size: ${(props) => props?.$fontSize};
    line-height: ${(props) => props?.$lineHeight};
    font-weight: ${(props) => props?.$fontWeight};
  `;

  const StyledImg = styled.img`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    cursor: pointer;
  `;

  const ContentSection = styled.div`
    width: calc(100% - 40px);
    margin: 20px 0 16px 20px;
  `;

  const UploadContainer = styled(ContentSection)`
    display: flex;
    flex-direction: row;
    gap: 16px;
  `;

  const OptionGrid = styled.div`
    width: auto;
    display: grid;
    grid-template-columns: auto auto;
    gap: 10px;
  `;

  return {
    Wrapper,
    Header,
    Left,
    Img,
    AnimatedBox,
    StyledDiv,
    StyledSpan,
    StyledImg,
    ContentSection,
    UploadContainer,
    OptionGrid,
  };
};

export default detailsPageStyle;
