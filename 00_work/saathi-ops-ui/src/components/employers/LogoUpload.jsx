import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useLogoUpload from '../../hooks/useLogoUpload';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { FILE_TYPES } from '../../constants';
import {
  generateAlphaNumericString,
  generateUploadFilePath,
} from '../../utils/helper';
import { LOGO_TEXT } from '../../constants/employer';
import ICONS from '../../assets/icons';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Container = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
const ContainerWithText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  padding-top: 6px;
`;

const LogoText = styled.p`
  font-weight: 400;
  font-size: 10px;
  color: #141482;
  text-decoration: ${({ isUnderlined }) =>
    isUnderlined ? 'underline' : 'none'};
`;

const StyledLabel = styled.label`
  cursor: pointer;
`;

const LogoInput = styled.input`
  display: none;
`;

const ID = generateAlphaNumericString();

const LogoUpload = ({
  initialIcon,
  successIcon,
  loadingIcon,
  uploadTitle = 'Upload Logo',
  fileType = 'image/png, image/jpeg, image/jpg',
  maxFileSizeInMB = 5,
  setImage,
  imageUrl = '',
  onUploadFn,
}) => {
  const { logo, isUploading, error, handleFileChange, status, isError, data } =
    useLogoUpload(
      generateUploadFilePath('LOGO', ID, FILE_TYPES?.IMAGE),
      FILE_TYPES?.IMAGE?.toUpperCase(),
      maxFileSizeInMB,
    );

  const [currentLogo, setCurrentLogo] = useState(
    initialIcon ? initialIcon : ICONS.UPLOAD_LOGO,
  );
  const [logoText, setLogoText] = useState(
    initialIcon ? LOGO_TEXT.SUCCESS : LOGO_TEXT.INITIAL,
  );

  useEffect(() => {
    if (initialIcon) {
      setCurrentLogo(initialIcon);
      setLogoText(LOGO_TEXT.SUCCESS);
    }
  }, [initialIcon]);

  useEffect(() => {
    if (status === 'success' && logo) {
      setCurrentLogo(logo);
      setLogoText(LOGO_TEXT.SUCCESS);
      setImage(logo);
      if (typeof onUploadFn === 'function') onUploadFn(logo);
    } else if (status === 'pending') {
      setCurrentLogo(loadingIcon);
      setLogoText(LOGO_TEXT.PENDING);
    }

    if (isError || error) {
      enqueueSnackbar(error || 'Failed to upload logo', {
        variant: 'error',
      });
    }
  }, [status, logo, isError, error, loadingIcon]);

  return (
    <StyledDiv>
      <ContainerWithText>
        <Container>
          <StyledLabel htmlFor="logo-upload">
            <StyledImg src={currentLogo} alt="Logo" />
          </StyledLabel>
          <LogoInput
            id="logo-upload"
            type="file"
            accept={fileType}
            onChange={handleFileChange}
          />
        </Container>

        <StyledLabel htmlFor="logo-upload">
          <LogoText isUnderlined={logoText === LOGO_TEXT.SUCCESS}>
            {logoText}
          </LogoText>
        </StyledLabel>
      </ContainerWithText>
    </StyledDiv>
  );
};

LogoUpload.propTypes = {
  initialIcon: PropTypes.string.isRequired,
  successIcon: PropTypes.string,
  loadingIcon: PropTypes.string.isRequired,
  uploadTitle: PropTypes.string,
  fileType: PropTypes.string,
  maxFileNameLength: PropTypes.number,
};

export default LogoUpload;
