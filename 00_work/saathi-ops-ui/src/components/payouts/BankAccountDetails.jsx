import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    background-color: #FFFFFF;
    margin: px;
    padding: 20px;
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
  background-color: #CDD4DF;
  margin: 8px 0;
`;

const BankAccountDetails = ({ bankAccountData }) => {
    return (
        <Wrapper data-testid="bank-account-wrapper">
            {bankAccountData.map((item, index) => (
                <React.Fragment key={index}>
                    <ContentSection>
                        <StyledField $fontWeight={400} $color={'#000000'}>
                            {item.label}
                        </StyledField>
                        <StyledField $color={'#5D5D5D'}>
                            {item.value}
                        </StyledField>
                    </ContentSection>
                    {index < bankAccountData.length - 1 && <Separator data-testid="account-separator"/>}
                </React.Fragment>
            ))}
        </Wrapper>
    );
};

export default BankAccountDetails;
