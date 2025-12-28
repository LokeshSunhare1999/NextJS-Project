import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    background-color: #FFFFFF;
    margin: px;
    padding: ${(props) =>
        props.$padding ? props.$padding : '20px'};;
    border-radius: 8px;
`;

const ContentSection = styled.div`
  display: flex;
  justify-content : space-between;
  flex-direction: ${(props) =>
        props.$flexDirection ? props.$flexDirection : 'row'};
  gap: ${(props) => props.$gap ?? null};
`;

const StyledField = styled.div`
  font-size: ${(props) => props.$fontSize || '14px'};
  line-height: ${(props) => props.$lineHeight || '24px'};
  font-weight: ${(props) => props.$fontWeight || 400};
  color: ${(props) => props.$color || '#666666'};
`;

const Separator = styled.div`
  height: 1px;
  background-color: #CDD4DF;
  margin: 8px 0;
`;

const AmountBreakup = ({ amountBreakupData }) => {
    if (!amountBreakupData || amountBreakupData?.length === 0) {
        return <Wrapper $padding={'16px'}><StyledField $fontWeight={500} $fontSize={"16px"} $color={"#666666"}>There is no amount breakup</StyledField></Wrapper>;
    }
    return (
        <Wrapper>
            {amountBreakupData.map((item, index) => (
                item ? (
                    <React.Fragment key={index}>
                        <ContentSection>
                            <StyledField $fontWeight={item.fontWeight} $color={item.color}>{item.label}</StyledField>
                            <StyledField $fontWeight={item.fontWeight} $color={item.color}>{item.value}</StyledField>
                        </ContentSection>
                        {index !== amountBreakupData?.length - 1 && <Separator />}
                    </React.Fragment>
                ) : null
            ))}
        </Wrapper>
    );
};

export default AmountBreakup;
