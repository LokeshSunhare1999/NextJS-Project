import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import CustomCTA from '../CustomCTA';
import Modal from '../Modal';
import useFileUpload from '../../hooks/useFileUpload';
import {
  FILE_TYPES,
  MAX_DOC_IMAGE_FILE_SIZE_MB,
  MAX_IMAGE_API_TIMER,
} from '../../constants';
import ICONS from '../../assets/icons';
import { usePostUploadToS3 } from '../../apis/queryHooks';
import ProgressBar from '../common/ProgressBar';
import { generateUploadFilePath, truncateFileName } from '../../utils/helper';
import DocumentFileUpload from './DocumentFileUpload';
import { usePutPanDetails } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';

const DocumentUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const P = styled.p`
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: 400;
  line-height: ${(props) => props.$lineHeight};
  color: ${(props) => (props.$color ? props.$color : '#000000')};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
  margin-bottom: ${(props) =>
    props.$marginBottom ? props.$marginBottom : '0px'};
  width: ${(props) => props?.width || 'auto'};
  border-bottom: ${(props) => props?.$borderBottom || 'none'};
`;
const DocumentHeader = styled.div`
  padding: 20px 0 0 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  border-bottom: 2px solid #000;
`;
const FlexContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => props.$flexDirection};
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: ${(props) => props?.$marginBottom || '10px'};
  margin-top: 10px;
`;
const DocumentUploder = styled.div`
  width: 251px;
  height: 149px;
  background-color: #f4f6fa;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const UploaderText = styled.p`
  font-family: Poppins;
  position: absolute;
  text-decoration: underline;
  display: flex;
  gap: 10px;
  cursor: pointer;
  &:hover {
    cursor: pointer;
  }
`;

const StyledInput = styled.input`
  height: 100%;
  width: 100%;
  opacity: 0%;
  cursor: pointer;
`;

const DocumentUpload = ({
  open,
  isOpen,
  heading = 'Upload PAN CARD',
  subheading = 'Upload',
  customerId,
  panUrl,
  setPanUrl,
  refetchCustomerData,
}) => {
  const [tempDelete, setTempDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleInputChange,
    fileData,
    resetFileData,
    setFileData,
    abortUpload,
    data,
    status,
    fileSizeError,
    setFileSizeError,
  } = useFileUpload(
    generateUploadFilePath('PAN', customerId, FILE_TYPES?.IMAGE),
    FILE_TYPES?.IMAGE?.toUpperCase(),
    MAX_DOC_IMAGE_FILE_SIZE_MB,
  );
  const {
    mutateAsync: updatePanDetailsMutation,
    status: updatePanDetailsStatus,
    isError: isUpdatePanDetailsErr,
    error: updatePanDetailsErr,
  } = usePutPanDetails();

  useEffect(() => {
    if (open) {
      setPanUrl('');
      resetFileData();
    }
  }, [open]);

  useEffect(() => {
    if (status === 'success') {
      setTempDelete(false);
      setPanUrl(data?.fileLink);
    }
  }, [status]);

  useEffect(() => {
    if (updatePanDetailsStatus === 'success') {
      isOpen(false);
      setIsLoading(false);
      refetchCustomerData();
      enqueueSnackbar('Pan Uploaded Succesfully', {
        variant: 'success',
      });
    } else if (updatePanDetailsStatus === 'error') {
      enqueueSnackbar(`Error Uploading Pan Card`, {
        variant: 'error',
      });
      isOpen(false);
      setIsLoading(false);
      refetchCustomerData();
    }
  }, [updatePanDetailsStatus]);

  useEffect(() => {
    if (tempDelete) {
      setPanUrl('');
    }
  }, [tempDelete]);

  useEffect(() => {
    if (fileSizeError) {
      enqueueSnackbar(
        `File size should be less than ${MAX_DOC_IMAGE_FILE_SIZE_MB}MB.`,
        {
          variant: 'error',
        },
      );
      setFileSizeError(false);
    }
  }, [fileSizeError]);

  const handleInputDelete = () => {
    setFileData(
      (prevFileData) => ({
        ...prevFileData,
        showProgress: false,
      }),
      setPanUrl(''),
    );
  };

  const cancelDocumentUpload = () => {
    isOpen(false);
  };
  const handleUploadClick = async () => {
    setIsLoading(true);
    await updatePanDetailsMutation({ panUrl, customerId });
  };

  return (
    <Modal isOpen={open} setIsOpen={isOpen}>
      <DocumentUploadContainer>
        <DocumentHeader>
          <P $marginBottom={'10px'}>{heading}</P>
          {/* <P $color="#141482" $marginTop={'10px'}>
            {subheading}
          </P> */}
        </DocumentHeader>
        <FlexContainer $flexDirection="column">
          {panUrl?.length > 0 ? (
            <img src={panUrl} width={'251px'} height={'149px'} />
          ) : (
            <DocumentUploder>
              <UploaderText>
                <img src={ICONS?.UPLOADFILE} alt="Open Book Icon" />
                PAN Card
              </UploaderText>
              <StyledInput
                type={'file'}
                accept="image/*"
                onChange={(e) => handleInputChange(e, FILE_TYPES?.IMAGE)}
              />
            </DocumentUploder>
          )}
          <DocumentFileUpload
            fileData={fileData}
            fileType={FILE_TYPES?.IMAGE}
            uploadTitle={'Upload PAN'}
            acceptType={'image/*'}
            handleInputChange={(e) => handleInputChange(e, FILE_TYPES?.IMAGE)}
            handleInputDelete={handleInputDelete}
            abortUpload={abortUpload}
            maxApiTimer={MAX_IMAGE_API_TIMER}
            uploadData={panUrl}
            tempDelete={tempDelete}
            setTempDelete={setTempDelete}
          />
        </FlexContainer>

        <FlexContainer $marginBottom={'24px'}>
          <CustomCTA
            color="#586275"
            bgColor="#fff"
            border="1px solid #CDD4DF"
            title="Cancel"
            onClick={cancelDocumentUpload}
          />
          <CustomCTA
            color="#141482"
            bgColor="#fff"
            border="1px solid #CDD4DF"
            title="Upload"
            onClick={handleUploadClick}
            disabled={!panUrl}
            isLoading={isLoading}
          />
        </FlexContainer>
      </DocumentUploadContainer>
    </Modal>
  );
};

export default DocumentUpload;
