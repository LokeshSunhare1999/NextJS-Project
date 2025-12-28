import React, { useRef } from 'react';
import styled from 'styled-components';
import DrawerInput from '../common/DrawerInput';
import Modal from '../Modal';
import CustomCTA from '../CustomCTA';
import FileUpload from '../courses/FileUpload';
import { ACCEPT_TYPE, FILE_TYPES, MAX_IMAGE_API_TIMER } from '../../constants';
import ICONS from '../../assets/icons';

const Wrapper = styled.div`
  padding: 20px;
`;
const StyledDiv = styled.div`
  white-space: nowrap;
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => (props?.$fontSize ? props.$fontSize : '14px')};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
  margin: ${(props) => props?.$margin ?? '0 0 20px 0'};
  width: ${(props) => props?.$width ?? 'auto'};
  display: flex;
  flex-direction: ${(props) => props?.$flexDirection ?? 'column'};
  gap: ${(props) => props?.$gap ?? '0'};
`;

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const LanguageChangeModal = ({
  testLang,
  setTestLang,
  langDropdownOpen,
  setLangDropdownOpen,
  open,
  setOpen,
  handleCsvUpload,
  selectedCsvFile,
  setSelectedCsvFile,
  handleLangSubmit,
}) => {
  const handleCsvDelete = () => {
    setSelectedCsvFile(null);
  };

  const handleLangSelect = (value) => {
    setTestLang(value);
    setLangDropdownOpen(false);
  };

  return (
    <Modal isOpen={open} setIsOpen={setOpen} width="503px">
      <Wrapper>
        <StyledDiv
          $color="#000"
          $fontSize="18px"
          $fontWeight={'600'}
          $lineHeight={'27px'}
        >
          Upload questions
        </StyledDiv>
        <DrawerInput
          isManadatory={true}
          fieldType={'dropdown'}
          fieldHeader={'Select Language'}
          //   fieldError={courseObjError?.courseCategory}
          //   errorText={'* Course category is required.'}
          fieldValue={testLang || 'Select Language'}
          handleDropDownSelect={handleLangSelect}
          dropDownOpen={langDropdownOpen}
          handleDropDownOpen={setLangDropdownOpen}
          dropDownList={['Hindi', 'English', 'Marathi']}
        />

        <StyledDiv
          $color="#000"
          $fontSize="16px"
          $fontWeight={'400'}
          $lineHeight={'24px'}
          $margin={'13px 0 8px 0'}
          $flexDirection="row"
        >
          Upload CSV
          <StyledDiv
            $color="#ED2F2F"
            $fontSize="16px"
            $lineHeight="20px"
            $fontWeight="400"
            $margin="0 0 0 5px"
          >
            *
          </StyledDiv>
        </StyledDiv>
        {selectedCsvFile ? (
          <StyledDiv
            $flexDirection={'row'}
            $fontSize={'12px'}
            $lineHeight={'18px'}
            $fontWeight={'400'}
            $margin={'8px 0 0 0'}
            $color={'#141482'}
            $gap={'8px'}
          >
            {selectedCsvFile?.name}
            <StyledImg
              src={ICONS?.DELETE_ICON}
              alt="delete-icon"
              width="14px"
              height="14px"
              onClick={handleCsvDelete}
            />
          </StyledDiv>
        ) : (
          <CustomCTA
            title={'Upload CSV'}
            showIcon={true}
            color={'#141482'}
            bgColor={'#ffffff'}
            border={'1px solid #141482'}
            url={ICONS.CSV_BLUE}
            width="16px"
            height="16px"
            padding="8px 16px"
            disabled={!testLang}
            disabledBgColor="#fff"
            opacity={testLang ? 1 : 0.5}
            acceptType={ACCEPT_TYPE?.CSV}
            isInput={true}
            handleInputChange={(e) => handleCsvUpload(e.target.files[0])}
          />
        )}

        <StyledDiv
          $margin={'61px 0 0 0'}
          $width={'100%'}
          $flexDirection="row-reverse"
        >
          <CustomCTA
            onClick={handleLangSubmit}
            title={'Submit'}
            color={'#FFF'}
            bgColor={'#141482'}
            border={'1px solid #CDD4DF'}
            buttonWidth="89px"
            disabled={!testLang && !selectedCsvFile}
            disabledBgColor="#141482"
            opacity={testLang && selectedCsvFile ? 1 : 0.5}
          />
        </StyledDiv>
      </Wrapper>
    </Modal>
  );
};

export default LanguageChangeModal;
