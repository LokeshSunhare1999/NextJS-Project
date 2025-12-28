import { Skeleton } from '@mui/material';
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import CustomCTA from '../components/CustomCTA';
import DisplayTable from '../components/DisplayTable';
import styleComponents from '../style/pageStyle';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import BoxLoader from '../components/common/BoxLoader';
import usePermission from '../hooks/usePermission';
import { MARKETING_CAMPAIGN_PERMISSIONS } from '../constants/permissions';
import { useGetAllCampaigns, usePostUploadCampaign } from '../apis/queryHooks';
import AddCampaignDrawer from '../components/campaign/AddCampaignDrawer';
import ICONS from '../assets/icons';
import { CAMPAIGN_TEMPLATE_URL, MAX_DOC_IMAGE_FILE_SIZE_MB } from '../constants';
import { bytesToMegabytes, downloadCSV } from '../utils/helper';
import useCampaignDetails from '../hooks/campaign/useCampaignDetails';

const Pagination = lazy(
  () => import('../components/atom/tableComponents/Pagination'),
);

const {
  Wrapper,
  Top,
  Bottom,
  HeaderWrap,
  HeaderRight,
  Header,
  HeaderTitle,
  HeaderDesc,
  AnimatedBox,
  Details,
  TableDiv,
} = styleComponents();

const campaigns = () => {
  const { hasPermission } = usePermission();
  const isMounted = useRef(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [showActionsPanel, setShowActionsPanel] = useState(true);
  const [campaignTableHeadersData, setCampaignTableHeadersData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openAddCampaignDrawer, setOpenAddCampaignDrawer] = useState(false);
  const [editCampaignData, setEditCampaignData] = useState(null);

  const {
    data: allCampaignsData,
    isLoading: allCampaignsDataLoading,
    isFetching: allCampaignsDataFetching,
    refetch: refetchAllCampaigns,
  } = useGetAllCampaigns({
    currentPage,
    itemsPerPage,
  });

  const {
    mutate: uploadCsv,
    status: uploadCsvStatus,
    isError: isUploadCsvError,
    error: uploadCSVError,
    isLoading: isUploadingCsv,
  } = usePostUploadCampaign();

  const {
    tableHeaders,
    headerTypes,
    rows,
  } = useCampaignDetails(
    campaignData,
    campaignTableHeadersData
  );

  useEffect(() => {
    if (!allCampaignsDataLoading) {
      setCampaignTableHeadersData(allCampaignsData?.headers || []);
      setCampaignData(allCampaignsData?.response || []);
      setTotalItems(allCampaignsData?.totalCampaign || 0)
      setCurrentPage(Number(searchParams.get('currentPage')) || 1)
    }
  }, [allCampaignsDataLoading, allCampaignsDataFetching]);

  useEffect(() => {
    if (uploadCsvStatus === 'success') {
      enqueueSnackbar('CSV uploaded successfully!', { variant: 'success' });
      refetchAllCampaigns();
    }
    if (isUploadCsvError) {
      enqueueSnackbar(
        uploadCSVError?.message || 'Failed to upload CSV file',
        { variant: 'error' }
      );
    }
  }, [uploadCsvStatus, isUploadCsvError, uploadCSVError]);

  const handleAddCampaignClick = () => {
    setEditCampaignData(null);
    setOpenAddCampaignDrawer(true);
  };

  const handleEditCampaignClick = (campaignData) => {
    setEditCampaignData(campaignData);
    setOpenAddCampaignDrawer(true);
  };

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
      searchParams.set('itemsPerPage', pageSize);
      searchParams.set('currentPage', 1);
    }
  };
  const handleRowClick = (e) => {
    e.stopPropagation();
    handleEditCampaignClick(campaignData[actionIndex]);
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleUploadAddCampaign = (event) => {
    const file = event.target.files[0];

    if (!file) {
      enqueueSnackbar('Please select a file to upload', { variant: 'warning' });
      return;
    }

    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      enqueueSnackbar('Please select a valid CSV file', { variant: 'error' });
      return;
    }

    const fileSizeInMB = bytesToMegabytes(file.size);
    if (fileSizeInMB > MAX_DOC_IMAGE_FILE_SIZE_MB) {
      enqueueSnackbar(`File size should not exceed ${MAX_DOC_IMAGE_FILE_SIZE_MB}MB`, { variant: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);
    uploadCsv(formData);

    event.target.value = '';
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(CAMPAIGN_TEMPLATE_URL);
      const csvText = await response.text();
      downloadCSV(csvText, 'campaign-template.csv');
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const arrBtn = [
    {
      text: 'Edit',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleRowClick,
      permission: MARKETING_CAMPAIGN_PERMISSIONS?.EDIT_MARKETING_CAMPAIGNS,
    },
  ];

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (arrBtn.length > 0) {
      const hasAnyPermission = arrBtn.some((btn) =>
        hasPermission(btn.permission),
      );
      setShowActionsPanel(hasAnyPermission);
    }
  }, [arrBtn, hasPermission]);

  return (
    <Wrapper>
      <Top>
        <HeaderWrap $alignItems={'start'}>
          <Header>
            <HeaderTitle>All Campaign</HeaderTitle>
            <HeaderDesc>Total Campaign: {totalItems}</HeaderDesc>
          </Header>
          <HeaderRight>
            <CustomCTA
              onClick={downloadTemplate}
              title={'Download Template'}
              showIcon={true}
              color={'#141482'}
              bgColor={'#ffffff'}
              border={'1px solid #141482'}
              url={ICONS.DOWNLOAD}
              isPermitted={hasPermission(
                MARKETING_CAMPAIGN_PERMISSIONS?.EDIT_MARKETING_CAMPAIGNS,
              )}
            />
            <CustomCTA
              title={'Upload CSV'}
              showIcon={true}
              color={'#141482'}
              bgColor={'#ffffff'}
              border={'1px solid #141482'}
              url={ICONS.UPLOAD}
              isInput={true}
              acceptType=".csv,text/csv"
              handleInputChange={handleUploadAddCampaign}
              isLoading={isUploadingCsv}
              loadingColor={'#141482'}
              disabled={!hasPermission(
                MARKETING_CAMPAIGN_PERMISSIONS?.EDIT_MARKETING_CAMPAIGNS,
              )}
              isPermitted={hasPermission(
                MARKETING_CAMPAIGN_PERMISSIONS?.EDIT_MARKETING_CAMPAIGNS,
              )}
            />
            <CustomCTA
              onClick={handleAddCampaignClick}
              title={'Add Campaign'}
              showIcon={true}
              color={'#FFF'}
              bgColor={'#141482'}
              border={'1px solid #CDD4DF'}
              disabled={!hasPermission(
                MARKETING_CAMPAIGN_PERMISSIONS?.EDIT_MARKETING_CAMPAIGNS,
              )}
              isPermitted={hasPermission(
                MARKETING_CAMPAIGN_PERMISSIONS?.EDIT_MARKETING_CAMPAIGNS,
              )}
            />
          </HeaderRight>
        </HeaderWrap>
        <Suspense
          fallback={
            <AnimatedBox>
              {[1, 2, 3, 4, 5].map((item, idx) => {
                return <Skeleton animation="wave" height={70} key={idx} />;
              })}
            </AnimatedBox>
          }
        >
          <Details>
            <TableDiv>
              {!(allCampaignsDataLoading || allCampaignsDataFetching) ? (
                <DisplayTable
                  tableId={'campaignTable'}
                  rows={rows}
                  headers={tableHeaders}
                  headersType={headerTypes}
                  showActionsPanel={showActionsPanel}
                  arrBtn={arrBtn}
                  actionIndex={actionIndex}
                  setActionIndex={setActionIndex}
                  actionOpen={actionOpen}
                  setActionOpen={setActionOpen}
                  arrBtnRight={'80px'}
                />
              ) : (
                <BoxLoader size={5} />
              )}
            </TableDiv>
          </Details>
        </Suspense>
      </Top>
      <Bottom>
        <Suspense
          fallback={
            <AnimatedBox>
              {[1].map((item, idx) => {
                return <Skeleton animation="wave" height={70} key={idx} />;
              })}
            </AnimatedBox>
          }
        >
          <Pagination
            onShowSizeChange={onShowSizeChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={totalItems}
            setTotalItems={setTotalItems}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            arrowBg={'#ebeff6'}
            isFlexColumn={false}
            isBottom={true}
            setOpenDropdown={setOpenDropdown}
            openDropdown={openDropdown}
            handleDropdown={handleDropdown}
            searchParams={searchParams}
            navigate={navigate}
            pageType={'campaigns'}
          />
        </Suspense>
        <Suspense>
          <AddCampaignDrawer
            open={openAddCampaignDrawer}
            setOpen={setOpenAddCampaignDrawer}
            refetchAllCampaigns={refetchAllCampaigns}
            editData={editCampaignData}
          />
        </Suspense>
      </Bottom>
    </Wrapper>
  );
};

export default campaigns;
