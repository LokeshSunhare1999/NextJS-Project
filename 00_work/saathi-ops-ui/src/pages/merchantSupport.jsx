import React, { Suspense, lazy, useEffect, useState } from 'react';
import CustomCTA from '../components/CustomCTA';
import { useSnackbar } from 'notistack';
import { useGetAllFieldAgents } from '../apis/queryHooks';
import Skeleton from '@mui/material/Skeleton';
import ICONS from '../assets/icons';
import { convertToCSV, downloadCSV, getNestedProperty } from '../utils/helper';
import styleComponents from '../style/pageStyle';
import {
  FIELD_AGENT_PERMISSIONS,
  PAGE_PERMISSIONS,
} from '../constants/permissions';
import usePermission from '../hooks/usePermission';
import useDeviceType from '../hooks/useDeviceType';
import { DEVICE_TYPES } from '../constants';
import styled from 'styled-components';
const SearchFilter = lazy(() => import('../components/SearchFilter'));
const DisplayTable = lazy(() => import('../components/DisplayTable'));
const AddAgentDrawer = lazy(
  () => import('../components/merchantSupport/AddAgentDrawer'),
);

const {
  Wrapper,
  Top,
  Bottom,
  HeaderWrap,
  Header,
  HeaderTitle,
  HeaderDesc,
  SearchDiv,
  SearchBox,
  AnimatedBox,
  Details,
} = styleComponents();

const TableDiv = styled.div`
  position: relative;
  margin: 22px 40px;
`;
const FlexContainer = styled.div`
  font-family: Poppins;
  width: ${(props) => (props.$width ? props.$width : '100%')};
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: 8px;
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;

const MerchantSupport = () => {
  const deviceType = useDeviceType();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = usePermission();

  const [fieldAgentsHeaderData, setFieldAgentHeaders] = useState([]);
  const [fieldAgentsData, setFieldAgentsData] = useState([]);
  const [filteredAgentsData, setFilteredFieldAgentsData] = useState([]);
  const [searchId, setSearchID] = useState('');
  const [activeSearchKey, setActiveSearchKey] = useState('');
  const [actionIndex, setActionIndex] = useState(null);
  const [actionOpen, setActionOpen] = useState(false);
  const [openAddAgentDrawer, setOpenAddAgentDrawer] = useState(false);
  const {
    data: allFieldAgents,
    isLoading: allFieldAgentsLoading,
    isFetching: allFieldAgentsFetching,
    status: allFieldAgentsStatus,
    isError: isAllFieldAgentsError,
    error: allFieldAgentsError,
    refetch: refetchAllFieldAgents,
  } = useGetAllFieldAgents();

  const handleSearchById = () => {
    setActiveSearchKey(searchId);
  };

  const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
      handleSearchById();
    }
  };

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search by Name/Mobile Number',
      width: '270px',
      setInput: setSearchID,
      enteredInput: searchId,
    },
  ];

  useEffect(() => {
    if (!allFieldAgentsLoading) {
      setFieldAgentHeaders(allFieldAgents?.headers || []);
      setFieldAgentsData(allFieldAgents?.response || []);
    }
  }, [allFieldAgentsLoading, allFieldAgentsFetching, allFieldAgents]);

  useEffect(() => {
    const parsedFieldAgentData = fieldAgentsData.filter((item) => {
      return (
        item?.name?.toLowerCase()?.includes(activeSearchKey?.toLowerCase()) ||
        item?.userContact?.phoneNo?.includes(activeSearchKey)
      );
    });
    setFilteredFieldAgentsData(parsedFieldAgentData);
  }, [fieldAgentsData, activeSearchKey]);

  useEffect(() => {
    if (allFieldAgentsError) {
      if (allFieldAgentsError?.response?.data?.error?.message) {
        enqueueSnackbar(allFieldAgentsError?.response?.data?.error?.message, {
          variant: 'error',
        });
      } else
        enqueueSnackbar('Something went wrong.', {
          variant: 'error',
        });
    }
  }, [isAllFieldAgentsError, allFieldAgentsError]);

  const tableHeaders = Array.from(
    fieldAgentsHeaderData?.map((item) => item?.value),
  );

  function createData(userDetails) {
    const headerKeys = Array.from(
      fieldAgentsHeaderData?.map((item) => item?.key) || [],
    );
    return headerKeys?.map((item) => {
      const itemKey = item?.replace(/['"]+/g, '');
      return getNestedProperty(userDetails, itemKey);
    });
  }

  const rows = Array.from(
    filteredAgentsData?.map((item) => createData(item)) || [],
  );

  const handleDownload = () => {
    const formattedData = filteredAgentsData?.map((item) => ({
      'User Name': item?.name,
      'Phone Number': item?.userContact?.phoneNo,
      'Tracking Referral Link': item?.trackingReferralLink,
      'Tracking Referral QR': item?.trackingReferralQRCodeLink,
    }));
    const csv = convertToCSV(formattedData);
    downloadCSV(csv, 'field-agents.csv');
  };

  const handleDownloadQrCode = () => {
    const qrCode =
      filteredAgentsData?.[actionIndex]?.trackingReferralQRCodeLink;

    if (!qrCode) {
      enqueueSnackbar('QR code link is not available', {
        variant: 'error',
      });
      return;
    }

    fetch(qrCode)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch the QR code');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        enqueueSnackbar('Error downloading the QR code:', {
          variant: 'error',
        });
      });

    setActionIndex(null);
  };

  const arrBtn = [
    {
      text: 'Download',
      icon: ICONS.DOWNLOAD,
      isVisible: true,
      color: '#000',
      iconHeight: '16px',
      iconWidth: '16px',
      onClick: () => {
        handleDownloadQrCode();
      },
    },
  ];
  return (
    <Wrapper>
      <Top>
        <HeaderWrap>
          <Header>
            <HeaderTitle>Merchant Support</HeaderTitle>
          </Header>
          <Suspense>
            <FlexContainer $width="auto">
              <CustomCTA
                onClick={handleDownload}
                title={'Download Agents'}
                showIcon={false}
                color={'#FFF'}
                bgColor={'#141482'}
                border={'1px solid #CDD4DF'}
                url={ICONS.DOWNLOAD}
                isPermitted={hasPermission(PAGE_PERMISSIONS?.VIEW_FIELD_AGENT)}
              />
              <CustomCTA
                onClick={() => setOpenAddAgentDrawer(true)}
                title={'Add Agent'}
                showIcon={false}
                color={'#FFF'}
                bgColor={'#141482'}
                border={'1px solid #CDD4DF'}
                isPermitted={hasPermission(
                  FIELD_AGENT_PERMISSIONS?.EDIT_FIELD_AGENT,
                )}
              />
            </FlexContainer>
          </Suspense>
        </HeaderWrap>

        <Suspense fallback={<div></div>}>
          <SearchDiv>
            <SearchBox>
              <SearchFilter
                searchArr={searchArr}
                isFilter={false}
                onKeyPress={handleEnterButton}
              />
              <CustomCTA
                onClick={handleSearchById}
                title={'Search'}
                color={'#FFF'}
                bgColor={'#141482'}
                isLoading={allFieldAgentsFetching}
                border={'1px solid #CDD4DF'}
                url={ICONS?.SEARCH_ICON}
              />
            </SearchBox>
          </SearchDiv>
        </Suspense>

        <Suspense
          fallback={
            <AnimatedBox>
              {[1, 2, 3, 4, 5].map((item, idx) => {
                return <Skeleton animation="wave" height={70} key={idx} />;
              })}
            </AnimatedBox>
          }
        >
          <TableDiv>
            <DisplayTable
              showActionsPanel
              tableId={'fieldAgentSupport'}
              highlightRow={true}
              rows={rows}
              headers={tableHeaders}
              headersType={Array.from(
                fieldAgentsHeaderData?.map((item) => item.type),
              )}
              tableWidth={'100%'}
              arrBtn={arrBtn}
              actionIndex={actionIndex}
              actionOpen={actionOpen}
              setActionIndex={setActionIndex}
              setActionOpen={setActionOpen}
            />
          </TableDiv>
        </Suspense>
      </Top>
      <Suspense>
        <AddAgentDrawer
          open={openAddAgentDrawer}
          setOpen={setOpenAddAgentDrawer}
          refetchAllFieldAgents={refetchAllFieldAgents}
        />
      </Suspense>
    </Wrapper>
  );
};

export default MerchantSupport;
