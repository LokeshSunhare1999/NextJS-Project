import React, { useEffect, useState } from 'react';
import styleComponents from '../../style/pageStyle';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import IMAGES from '../../assets/images';
import { useGetEarnings } from '../../apis/queryHooks';
import { weeksList, weekListMap } from '../../constants/employer';
import DrawerInput from '../common/DrawerInput';
import { CircularProgress } from '@mui/material';
import { zIndexValues } from '../../style';
import CustomCTA from '../CustomCTA';
import { inputRangeCheck } from '../../utils/helper';
import {
  COMPANY_SIZE_MAX_LIMIT,
  EMPLOYER_DEFAULT_MIN,
} from '../../constants/employer';

const FlexContainer = styled.div`
  font-family: Poppins;
  width: 100%;
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 61px);
  position: fixed;
  top: 61px;
  z-index: 15;
  object-fit: cover;
`;

const ContainerImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 16;
`;

const AbsFlexContainer = styled(FlexContainer)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${zIndexValues.CALCULATE_EARNING_CONTAINER};
  widht: 100%;
  height: 80%;
  display: flex;
  gap: 8px;
`;

const P = styled.p`
  white-space: nowrap;
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => (props?.$fontSize ? props.$fontSize : '14px')};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
  margin-top: ${(props) => props?.$marginTop};
  text-decoration: ${(props) => props?.$textDecoration};
  cursor: ${(props) => props?.$cursor};
`;
const H1 = styled.h1`
  white-space: nowrap;
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => (props?.$fontSize ? props.$fontSize : '14px')};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
`;

const NumberInWordstext = styled.p`
  white-space: nowrap;
  color: #51e5ff;
  font-family: Gelasio !important;
  font-size: ${(props) => (props?.$fontSize ? props.$fontSize : '14px')};
  font-style: italic;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
`;

const Img = styled.img`
  width: ${(props) => props.width || '56px'};
  height: ${(props) => props.height || '56px'};
  cursor: pointer;
`;

const StyledText = styled.div`
  background: linear-gradient(90deg, #d499ff 0%, #4de7ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  font-size: ${(props) => props.$fontSize ?? '150px'};
  font-style: normal;
  font-weight: 700;
  line-height: ${(props) => props.$lineHeight ?? '177.5px'};
  margin-left: 28px;
`;

const LeftArrow = styled.div`
  position: absolute;
  top: 40px;
  left: 80px;
  z-index: ${zIndexValues.BACK_ARROW};
`;

const NextArrow = styled.div`
  position: absolute;
  bottom: 50px;
  right: 40px;
  z-index: 17;
`;
const CalculateButton = styled.div`
  position: absolute;
  bottom: 50px;
  left: 40px;
  z-index: 17;
`;
const CalculateDiv = styled.div`
  display: flex;
  position: absolute;
  bottom: 50px;
  left: 40px;
  z-index: 17;
  background: linear-gradient(
    90deg,
    rgba(36, 0, 140, 0.52) 0%,
    rgba(76, 0, 173, 0.52) 100%
  );
  align-items: end;
  border: 2px solid #d499ff;
  border-radius: 10px;
  padding: 10px 20px;
  gap: 20px;
`;
const ContentSection = styled.div`
  width: 250px;
`;
const CalculateSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 230px;
`;
const CloseDrawer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
`;
const RefreshButton = styled.div`
  cursor: pointer;
`;

const CalculateEarnings = ({
  createAccObj,
  handleOpenCreateAccountModal = () => {},
  setIsCalculateEarningsVisible = () => {},
  setOpenCreateAccDrawer,
  openCreateAccDrawer,
  createAccErr,
  setCreateAccErr,
  setCreateAccObj,
  referralPerPerson,
  setReferralPerPerson,
}) => {
  const { companySize, companyName } = createAccObj;
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState(weeksList[3]);
  const branch = weekListMap[selectedDays];
  const [payload, setPayload] = useState({
    companySize,
    branch: referralPerPerson,
  });

  const {
    data: allEarningsData,
    isLoading: allEarningsLoading,
    isFetching: allEarningsFetching,
    refetch: allEarningsRefetch,
    status: allEarningsStatus,
  } = useGetEarnings(payload);
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
  const [referral, setReferral] = useState(companySize);
  const [perPersonRefer, setPerPersonRefer] = useState(referralPerPerson);
  const handleLeftArrow = () => {
    setIsCalculateEarningsVisible(false);
    setOpenCreateAccDrawer(!openCreateAccDrawer);
  };

  const handleCreateAccDrawer = () => {
    if (
      allEarningsStatus === 'pending' ||
      !allEarningsData ||
      allEarningsFetching
    )
      return;
    setCreateAccObj({
      ...createAccObj,
      companySize: referral,
      potentialEarnings: allEarningsData?.weeklyEarnings[3],
    });
    setReferralPerPerson(perPersonRefer);
    handleOpenCreateAccountModal(createAccObj);
  };

  const handleCategorySelect = (item) => {
    setSelectedDays(item);
    setCategoryOpen(!categoryOpen);
  };

  const handleCalculateAgain = () => {
    setIsCalculatorVisible(true);
  };
  const handleCloseCalculator = () => {
    setIsCalculatorVisible(false);
  };

  const handleFieldChange = (e, fieldName) => {
    const value = e.target.value;
    if (
      value === '' ||
      (!isNaN(value) && value.trim() !== '' && Number(value) <= 1000000)
    ) {
      if (fieldName === 'referral') {
        setReferral(value);
        setCreateAccObj({ ...createAccObj, companySize: value });
      } else if (fieldName === 'perPersonRefer') {
        setPerPersonRefer(value);
      }
    }
  };
  const handleResetCalculator = () => {
    setReferral(companySize);
    setPerPersonRefer(referralPerPerson);
  };
  const handleRecalculateClick = () => {
    setPayload({ companySize: referral, branch: perPersonRefer });
    setSelectedDays(weeksList[3]);
  };
  useEffect(() => {
    allEarningsRefetch();
  }, [payload]);

  return (
    <Container>
      <ContainerImage src={IMAGES.CALCULATE_EARNINGS} />
      <LeftArrow>
        <Img src={ICONS.EARNING_BACK} alt='leftArrow' onClick={() => handleLeftArrow()}/>
      </LeftArrow>
      <AbsFlexContainer
        $flexDirection="column"
        $alignItems="center"
        $justifyContent="center"
      >
        <P
          $color="#FFC107"
          $fontSize="19px"
          $fontWeight="600"
          $lineHeight={'29px'}
        >
          Potential Earnings
        </P>
        <H1
          $color="#FFFFFF"
          $fontSize="38px"
          $fontWeight="600"
          $lineHeight={'38px'}
        >
          {companyName}
        </H1>
        {!(allEarningsLoading || allEarningsFetching) ? (
          <>
            <FlexContainer $justifyContent="center" $alignItems="center">
              <Img width="52px" height="178px" src={ICONS?.RUPEE} />
              <StyledText>{allEarningsData?.weeklyEarnings[branch]}</StyledText>
              <StyledText $fontSize={'65px'}>/-</StyledText>
            </FlexContainer>
            <NumberInWordstext
              $color="#fff"
              $fontSize="24px"
              $fontWeight="400"
              $lineHeight={'29px'}
            >
              {allEarningsData?.earningsInWords[branch]}
            </NumberInWordstext>
            <DrawerInput
              $background="red"
              border="none"
              isManadatory={false}
              fieldType={'days'}
              fieldValue={`${selectedDays}`}
              handleDropDownSelect={handleCategorySelect}
              dropDownOpen={categoryOpen}
              handleDropDownOpen={setCategoryOpen}
              dropDownList={weeksList}
            />
          </>
        ) : (
          <CircularProgress size={60} />
        )}
      </AbsFlexContainer>
      {!isCalculatorVisible && (
        <CalculateButton onClick={() => handleCalculateAgain()}>
          <P
            $color="#FFF"
            $fontSize="21px"
            $fontWeight="600"
            $lineHeight={'30px'}
            $textDecoration="underline"
            $cursor="pointer"
          >
            Calculate Again
          </P>
        </CalculateButton>
      )}
      {isCalculatorVisible && (
        <CalculateDiv>
          <ContentSection>
            <DrawerInput
              fieldType={'input'}
              fieldHeader={'1st Degree Referrals'}
              fieldError={createAccErr?.companySize}
              fieldPlaceholder={'Enter your 1st Degree Referral'}
              fieldValue={referral}
              handleFieldChange={(e) => handleFieldChange(e, 'referral')}
              isManadatory={true}
              color={'#FFF'}
              errorText={`*error`}
            />
          </ContentSection>
          <ContentSection>
            <DrawerInput
              fieldType={'input'}
              fieldHeader={'Referral Per Person'}
              isManadatory={true}
              fieldPlaceholder={'Enter your Referral per person'}
              fieldValue={perPersonRefer}
              handleFieldChange={(e) => handleFieldChange(e, 'perPersonRefer')}
              color={'#FFF'}
              errorText={`*error`}
            />
          </ContentSection>
          <CalculateSection>
            <CustomCTA
              title={'Calculate'}
              color={'#3B2B8C'}
              fontWeight={'600'}
              bgColor={'linear-gradient(90deg, #d499ff 0%, #4de7ff 100%)'}
              border={'1px solid #3B2B8C;'}
              fontSize="18px"
              lineHeight="30px"
              padding="6.5px 30px"
              onClick={() => handleRecalculateClick()}
              disabled={!referral || !perPersonRefer}
            />
            <RefreshButton onClick={() => handleResetCalculator()}>
              {' '}
              <img src={ICONS.REFRESH} alt="Refresh" />
            </RefreshButton>

            <CloseDrawer onClick={() => handleCloseCalculator()}>
              <img src={ICONS.CROSS_BUTTON_WHITE} alt="close" />
            </CloseDrawer>
          </CalculateSection>
        </CalculateDiv>
      )}
      <NextArrow onClick={() => handleCreateAccDrawer()}>
        <Img
          src={ICONS.NEXT_BUTTON}
          alt="leftArrowBlack"
          width={'149px'}
          height={'56px'}
        />
      </NextArrow>
    </Container>
  );
};

export default CalculateEarnings;
