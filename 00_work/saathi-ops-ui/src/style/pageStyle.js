import { Box } from '@mui/material';
import styled from 'styled-components';
import { DEVICE_TYPES } from '../constants';

const styleComponents = () => {
  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: ${(props) =>
      props?.$deviceType === DEVICE_TYPES?.MOBILE
        ? '61px 0 0 0px'
        : '61px 0 0 265px'};
    min-height: calc(100vh - 3.5rem);
    background-color: #f4f6fa;
    font-family: Poppins;
  `;

  const Top = styled.div``;

  const Bottom = styled.div`
    padding-bottom: 20px;
  `;

  const HeaderWrap = styled.div`
    width: calc(100% - 80px);
    margin: 0px 40px 20px 40px;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: ${(props) =>
      props?.$alignItems ? props?.$alignItems : 'center'};
  `;

  const Header = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const HeaderTitle = styled.div`
    display: flex;
    flex-direction: column;
    color: #000;
    font-family: Poppins;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  `;
  const HeaderRight = styled.div`
    margin: 0px 0px 20px 40px;
    padding: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  `;

  const HeaderDesc = styled.span`
    width: auto;
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
  `;

  const SearchDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: start;
    width: calc(100% - 80px);
    margin: ${(props) =>
      props?.$deviceType === DEVICE_TYPES?.MOBILE
        ? '20px 40px 0 40px'
        : '0px 40px'};
    margin-left: ${(props) =>
      props?.$marginLeft ? props?.$marginLeft : '40px'};
  `;

  const SearchBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  `;

  const PaginationWrapTop = styled(SearchDiv)`
    margin: 20px 40px;
    justify-content: end;
  `;

  const MenuTab = styled.div`
    display: flex;
    padding: 0px 40px;
    align-items: flex-start;
    width: calc(100% - 80px);
    margin: 0px 0px;
    border-bottom: 1px solid #cdd4df;
  `;

  const MenuBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
  `;

  const Tab = styled.div`
    display: flex;
    padding: 5px 0px;
    height: auto;
    align-items: flex-start;
    border-bottom: 3px solid #141482;
  `;
  const P = styled.p`
    color: ${(props) => props.$color};
    font-family: Poppins;
    font-size: ${(props) => props.$fontSize};
    font-style: normal;
    font-weight: ${(props) => props.$fontWeight};
    line-height: ${(props) => props.$lineHeight};
  `;

  const AnimatedBox = styled(Box)`
    width: calc(100% - 55px);
  `;

  const Details = styled.div`
    width: ${(props) =>
      props?.$deviceType !== DEVICE_TYPES?.MOBILE
        ? 'calc(100% - 40px)'
        : 'calc(100% - 20px)'};
    margin: ${(props) =>
      props?.$deviceType !== DEVICE_TYPES?.MOBILE ? '22px 40px' : '22px 20px'};
  `;

  const PaginationWrap = styled.div`
    width: ${(props) => (props.$isBackground ? 'calc(100% - 120px)' : '100%')};
    margin: ${(props) => (props.$isBackground ? '0px 40px' : '0px')};
    padding: ${(props) => (props.$isBackground ? '8px 20px' : '0px')};
    border-radius: ${(props) => (props.$isBackground ? '10px' : '0px')};
    background: ${(props) => (props.$isBackground ? '#fff' : 'inherit')};
  `;

  const TopPageWrap = styled.div`
    margin-right: 40px;
  `;

  const TableDiv = styled.div`
    position: relative;
  `;

  return {
    Wrapper,
    Top,
    Bottom,
    HeaderWrap,
    Header,
    HeaderTitle,
    HeaderDesc,
    HeaderRight,
    SearchDiv,
    SearchBox,
    PaginationWrapTop,
    MenuTab,
    MenuBox,
    Tab,
    P,
    AnimatedBox,
    Details,
    PaginationWrap,
    TopPageWrap,
    TableDiv,
  };
};

export default styleComponents;
