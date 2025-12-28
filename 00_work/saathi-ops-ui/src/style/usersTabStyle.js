import styled from 'styled-components';

const userTabStyles = () => {
  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
  `;

  const HeaderDiv = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  `;

  const StyledDiv = styled.div`
    width: ${(props) => props.$width ?? '100%'};
    height: ${(props) => props.$height ?? 'auto'};
    display: ${(props) => props.$display ?? 'flex'};
    flex-direction: ${(props) => props.$flexDirection ?? 'row'};
    justify-content: ${(props) => props.$justifyContent ?? 'flex-start'};
    align-items: ${(props) => props.$alignItems ?? 'center'};
    gap: ${(props) => props.$gap ?? '0'};
  `;

  const TableDiv = styled.div`
    position: relative;
  `;

  const StyledHeader = styled.p`
    font-size: ${(props) => props?.$fontSize};
    line-height: ${(props) => props?.$lineHeight};
    font-weight: ${(props) => props?.$fontWeight};
    color: ${(props) => props?.$color};
    margin: ${(props) => props?.$margin};
    width: ${(props) => (props?.$width ? props?.$width : '100%')};
    display: flex;
    align-items: center;
    justify-content: ${(props) =>
      props.$justifyContent ? props.$justifyContent : 'space-between'};
    gap: ${(props) => (props.$gap ? props.$gap : '10px')};
    opacity: ${(props) => (props.$opacity ? props.$opacity : '1')};
  `;

  const ContentSection = styled.div`
    width: calc(100% - 40px);
    margin: 20px 0 16px 20px;
  `;

  const TopPageWrap = styled.div`
    // width: 50%;
    margin-bottom: 20px;
  `;

  return {
    Wrapper,
    HeaderDiv,
    StyledDiv,
    TableDiv,
    StyledHeader,
    ContentSection,
    TopPageWrap,
  };
};

export default userTabStyles;
