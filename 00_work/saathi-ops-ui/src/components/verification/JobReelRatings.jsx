import React, { useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import { RATING_CHECKS } from '../../constants';

// Styled Components
const Wrapper = styled.div`
  margin-top: 20px;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
const SelectedIconWrapper = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
`;
const Container = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #f1f1f1;
  border-radius: 10px;
  padding: 1rem;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #000;
  line-height: 17px;
`;

const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Option = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  padding: 10px;
  border: 1.5px solid ${({ selected }) => (selected ? '#141482' : '#EEEEEE')};
  background: ${({ selected }) => (selected ? '#F2F0FF' : '#fff')};
  border-radius: 12px;
  width: 145px;
  height: 70px;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
  &:hover {
    border-color: #141482;
  }
`;

const StyledRatings = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #3c3c3c;
  line-height: 14px;
`;

const Description = styled.div`
  font-size: 12px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const P = styled.p`
  color: ${(props) => props.$color || '#000'};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  padding: ${(props) => props.$padding};
`;

const StyledSpan = styled.span`
  color: ${(props) => props?.$color};
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  margin-left: 4px;
`;

const ErrorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const JobReelRatings = ({ selectedRatings, setSelectedRatings, errors }) => {
  const handleSelect = (groupKey, index) => {
    setSelectedRatings((prev) => ({ ...prev, [groupKey]: index }));
  };

  return (
    <Wrapper>
      <P $fontSize={'16px'} $fontWeight={'600'}>
        Ratings
        {/* <StyledSpan
          $fontSize={'16px'}
          $lineHeight={'24px'}
          $fontWeight={'400'}
          $color={'#ED2F2F'}
        >
          *
        </StyledSpan> */}
      </P>
      <Container>
        {RATING_CHECKS.map(({ key, label, options }) => (
          <StyledRow key={key}>
            <Title>
              {label}{' '}
              {/* <StyledSpan
                $fontSize={'16px'}
                $lineHeight={'24px'}
                $fontWeight={'400'}
                $color={'#ED2F2F'}
              >
                *
              </StyledSpan> */}
            </Title>
            <Options>
              {options.map((text, index) => (
                <Option
                  key={index}
                  selected={selectedRatings[key] === index}
                  onClick={() => handleSelect(key, index)}
                >
                  {selectedRatings[key] === index && (
                    <SelectedIconWrapper>
                      <Img
                        src={ICONS.VERIFIED}
                        alt="selected"
                        width="20px"
                        height="20px"
                      />
                    </SelectedIconWrapper>
                  )}
                  <StyledRatings>
                    {index}
                    <Img
                      src={ICONS.STAR}
                      alt="rating star"
                      width="11px"
                      height="11px"
                    />
                  </StyledRatings>
                  <Description>{text}</Description>
                </Option>
              ))}
            </Options>
            {errors?.[key] && (
              <ErrorBox>
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {errors[key]}
                </P>
              </ErrorBox>
            )}
          </StyledRow>
        ))}
      </Container>
    </Wrapper>
  );
};

export default JobReelRatings;
