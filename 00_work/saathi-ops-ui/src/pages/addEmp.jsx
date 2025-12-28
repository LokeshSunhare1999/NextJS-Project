import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import BasicDetails from '../components/employers/BasicDetails';
import BusinessProof from '../components/employers/BusinessProof';
import CompanyAddress from '../components/employers/CompanyAddress';
import CustomCTA from '../components/CustomCTA';
import styleComponents from '../style/pageStyle';
import { CircularProgress } from '@mui/material';
import {
  useGetCityStateByPincode,
  useGetEmployerDetails,
  useGetGlobalEmployerData,
  useGetWebsiteDomainCheck,
  usePostAddEmployer,
  usePutUpdateEmployerStatus,
  useGetCompanyDetailsByDocumentNo,
} from '../apis/queryHooks';

import ICONS from '../assets/icons';
import LogoUpload from '../components/employers/LogoUpload';
import useAddEmployer from '../hooks/employer/useAddEmployer';
import { COMPANY_FORM_DETAILS } from '../constants/employer';

const LeftArrow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
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

const StyledHeader = styled.div`
  margin-top: 20px;
`;

const HeaderWrap = styled.div`
  padding: 20px;
`;

const Content = styled.div`
  margin-top: 10px;
`;

const Bottom = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
`;
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const { Wrapper, Top, Header, HeaderTitle } = styleComponents();
const AddEmployer = () => {
  const [errors, setErrors] = useState({});
  const [domain, setDomain] = useState('');
  const [employerData, setEmployerData] = useState(COMPANY_FORM_DETAILS);
  const [logoUrl, setLogoUrl] = useState('');
  const [pincode, setPincode] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [searchParams] = useSearchParams();
  const [info, setInfo] = useState({});
  const agencyType = searchParams?.get('agencyType');
  const employerId = searchParams?.get('id');
  const isEditMode = Boolean(employerId);

  const navigate = useNavigate();
  const { data: globalData } = useGetGlobalEmployerData();

  const {
    data: cityStateData,
    status: cityStateDataStatus,
    refetch: cityStateDataRefetch,
  } = useGetCityStateByPincode(pincode);

  const {
    data: checkDomainData,
    isLoading: isCheckDomainDataLoading,
    refetch: checkDomainDataRefetch,
    error: checkDomainDataError,
  } = useGetWebsiteDomainCheck(domain);

  const { data: employerDetailsData } = useGetEmployerDetails(employerId);
  const {
    data: companyData,
    status: companyDataStatus,
    refetch: companyDataRefetch,
    isFetching: isCompanyDataLoading,
  } = useGetCompanyDetailsByDocumentNo({
    documentNumber,
    documentType,
  });

  const {
    mutateAsync: updateEmployerStatusMutation,
    status: updateEmployerStatus,
    error: updateEmployerStatusErr,
  } = usePutUpdateEmployerStatus(employerId);

  const { mapResponseToFormDetails, generateEmployerPayload, validateFields } =
    useAddEmployer({
      employerData,
      setEmployerData,
      domain,
      checkDomainDataRefetch,
      pincode,
      cityStateDataRefetch,
      setErrors,
      agencyType,
      employerDetailsData,
      companyDataRefetch,
      documentNumber,
      documentType,
    });

  useEffect(() => {
    if (cityStateDataStatus === 'success') {
      setEmployerData((prev) => ({
        ...prev,
        city: cityStateData?.city || '',
        state: cityStateData?.state || '',
      }));
    } else if (cityStateDataStatus === 'error') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pincode: 'Invalid Pincode',
      }));
      setEmployerData((prev) => ({
        ...prev,
        city: '',
        state: '',
      }));
    }
  }, [cityStateDataStatus]);

  useEffect(() => {
    if (companyDataStatus === 'success') {
      setEmployerData((prev) => ({
        ...prev,
      }));
      setInfo((prevInfo) => ({
        ...prevInfo,
        [documentType]: companyData?.[documentType.toLowerCase()]
          ? `Name as per document is "${companyData?.companyName}"`
          : prevInfo[documentType],
      }));
    } else if (companyDataStatus === 'pending') {
      setInfo((prev) => ({
        ...prev,
      }));
    }
  }, [companyDataStatus, companyData]);
  // ... existing code ...
  useEffect(() => {
    if (employerDetailsData?.companyWebsiteUrl)
      setDomain(employerDetailsData?.companyWebsiteUrl);
    if (employerDetailsData?.currentAddress?.pincode)
      setPincode(employerDetailsData?.currentAddress?.pincode);
    setLogoUrl(employerDetailsData?.companyLogoUrl);
  }, [employerDetailsData]);

  useEffect(() => {
    setEmployerData((prev) => ({
      ...prev,
      city: cityStateData?.city || '',
      state: cityStateData?.state || '',
    }));
  }, [cityStateData]);

  const handleBlur = () => {
    setDomain(employerData?.companyWebsiteURL);
  };

  useEffect(() => {
    setEmployerData((prev) => ({
      ...prev,
      companyLogoUrl: logoUrl,
    }));
  }, [logoUrl]);

  useEffect(() => {
    if (isEditMode && employerDetailsData) {
      const preFilledEmployerData =
        mapResponseToFormDetails(employerDetailsData);
      setEmployerData(preFilledEmployerData);
    }
  }, [isEditMode, employerDetailsData]);

  const {
    mutate: postAddEmployerMutate,
    status: postAddEmployerStatus,
    error: postAddEmployerError,
  } = usePostAddEmployer();

  useEffect(() => {
    if (postAddEmployerStatus === 'success') {
      setErrors({});
      enqueueSnackbar('Employer added successfully', {
        variant: 'success',
      });
      navigate('/employers');
    } else if (postAddEmployerStatus === 'error') {
      if (postAddEmployerError?.response?.data?.error?.message) {
        enqueueSnackbar(postAddEmployerError?.response?.data?.error?.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Failed to add employer', {
          variant: 'error',
        });
      }
    }
  }, [postAddEmployerStatus]);

  useEffect(() => {
    if (updateEmployerStatus === 'success') {
      setErrors({});
      enqueueSnackbar('Employer updated successfully', {
        variant: 'success',
      });
      navigate(-1);
    } else if (updateEmployerStatus === 'error') {
      if (postAddEmployerError?.response?.data?.error?.message) {
        enqueueSnackbar(postAddEmployerError?.response?.data?.error?.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Failed to update employer', {
          variant: 'error',
        });
      }
    }
  }, [updateEmployerStatus]);

  const handleLeftArrow = () => {
    navigate(-1);
  };

  const handleCreateEmployer = async () => {
    const isValidData = await validateFields(
      employerData,
      domain,
      checkDomainDataRefetch,
      setErrors,
    );

    if (isValidData) {
      const payload = generateEmployerPayload(
        employerData,
        agencyType,
        employerDetailsData,
      );
      if (isEditMode) {
        updateEmployerStatusMutation(payload);
      } else {
        postAddEmployerMutate(payload);
      }
    } else if (!isValidData) {
      enqueueSnackbar(`Some fields are invalid. Please check and try again.`, {
        variant: 'error',
      });
    } else if (postAddEmployerError || updateEmployerStatusErr) {
      enqueueSnackbar(`Failed to ${isEditMode ? 'add' : 'update'} employer`, {
        variant: 'error',
      });
    }
  };

  return (
    <Wrapper>
      <Top>
        <HeaderWrap>
          <Header>
            <LeftArrow>
              <Left onClick={() => handleLeftArrow()}>
                <Img
                  src={ICONS?.LEFT_ARROW_BLACK}
                  alt="leftArrowBlack"
                  width={'24px'}
                  height={'24px'}
                />
              </Left>
            </LeftArrow>
            <StyledHeader>
              <HeaderWrapper>
                <HeaderTitle>
                  {isEditMode ? 'Edit Account' : 'Create Account'}
                </HeaderTitle>
                <LogoUpload
                  initialIcon={logoUrl}
                  loadingIcon={ICONS.UPLOADING_LOGO}
                  setImage={setLogoUrl}
                  imageUrl={logoUrl}
                  maxFileSizeInMB={5}
                />
              </HeaderWrapper>
              <Content>
                <BasicDetails
                  data={employerData}
                  setData={setEmployerData}
                  errors={errors}
                  setErrors={setErrors}
                  isEditMode={isEditMode}
                />
                <BusinessProof
                  data={employerData}
                  setData={setEmployerData}
                  errors={errors}
                  setErrors={setErrors}
                  globalData={globalData}
                  handleBlur={handleBlur}
                  checkDomainData={checkDomainData}
                  isCheckDomainDataLoading={isCheckDomainDataLoading}
                  checkDomainDataError={checkDomainDataError}
                  domain={domain}
                  info={info}
                  setInfo={setInfo}
                  companyData={companyData}
                  documentNumber={documentNumber}
                  setDocumentNumber={setDocumentNumber}
                  documentType={documentType}
                  setDocumentType={setDocumentType}
                  isCompanyDataLoading={isCompanyDataLoading}
                />
                <CompanyAddress
                  data={employerData}
                  setData={setEmployerData}
                  errors={errors}
                  setErrors={setErrors}
                  setPincode={setPincode}
                />
              </Content>
            </StyledHeader>
          </Header>
        </HeaderWrap>
      </Top>

      <Bottom>
        <CustomCTA
          onClick={handleCreateEmployer}
          title={isEditMode ? 'Update Details' : 'Create Account'}
          color={'#FFF'}
          bgColor={'#141482'}
          border={'1px solid #CDD4DF'}
          isLoading={
            postAddEmployerStatus === 'pending' ||
            updateEmployerStatus === 'pending'
          }
          disabled={
            !employerData?.companyName ||
            !employerData?.workPhone ||
            isCompanyDataLoading
          }
        />
      </Bottom>
    </Wrapper>
  );
};

export default AddEmployer;
