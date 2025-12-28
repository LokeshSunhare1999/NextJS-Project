import { Skeleton } from '@mui/material';
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import CustomCTA from '../components/CustomCTA';
import DisplayTable from '../components/DisplayTable';
import { employers } from '../mockData';
import styleComponents from '../style/pageStyle';
import ICONS from '../assets/icons';
import CreateAccDrawer from '../components/employers/CreateAccDrawer';
import CalculateEarnings from '../components/employers/CalculateEarnings';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useGetAllEmployer,
  useGetSubscriptionData,
  usePostAddEmployer,
} from '../apis/queryHooks';
import { useSnackbar } from 'notistack';
import { DEFAULT_REF_BRANCH, companyTypeMap } from '../constants/employer';
import { generateRandomString } from '../utils/helper';
import CreateAccDrawerNext from '../components/employers/CreateAccDrawerNext';
import BoxLoader from '../components/common/BoxLoader';
import usePermission from '../hooks/usePermission';
const SearchFilter = lazy(() => import('../components/SearchFilter'));
import {
  EMPLOYER_MODULE_PERMISSIONS,
  PAGE_PERMISSIONS,
  PAYMENT_PERMISSIONS,
} from '../constants/permissions';
import SelectEmpAgencyDrawer from '../components/employers/SelectEmpAgencyDrawer';
import { generateSearchParams } from '../utils/helper';
import useEmployerFilter from '../hooks/employer/useEmployerFilters';
import SubsciptionDrawer from '../components/employers/SubscriptionDrawer';
const Pagination = lazy(
  () => import('../components/atom/tableComponents/Pagination'),
);
const FilterDrawer = lazy(() => import('../components/common/FilterDrawer'));

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
  SearchDiv,
  SearchBox,
  TopPageWrap,
} = styleComponents();

const employerDetails = [
  {
    key: 'DIRECT_EMPLOYER',
    value: 'Direct Employer',
    checked: false,
    icon: ICONS.DIRECT_EMPLOYER,
  },
  {
    key: 'RECRUITMENT_AGENCY',
    value: 'Recruitment Agency',
    checked: false,
    icon: ICONS.REC_AGENCY,
  },
  {
    key: 'STAFFING_AGENCY',
    value: 'Staffing Agency',
    checked: false,
    icon: ICONS.STAFFING_AGENCY,
  },
  {
    key: 'FACILITY_MANAGEMENT',
    value: 'Facility Management',
    checked: false,
    icon: ICONS.FACILITY_MANAGEMENT,
  },
];

const Employers = () => {
  const { hasPermission } = usePermission();
  const isMounted = useRef(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [showActionsPanel, setShowActionsPanel] = useState(true);
  const [employerTableHeadersData, setEmployerTableHeadersData] = useState([]);
  const [employerData, setEmployerData] = useState([]);
  const [totalEmployer, setTotalEmployer] = useState(0);
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchId, setSearchID] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openCreateAccDrawer, setOpenCreateAccDrawer] = useState(false);
  const [openSelectEmpAgencyDrawer, setOpenSelectEmpAgencyDrawer] =
    useState(false);
  const [openCreateAccDrawerNext, setOpenCreateAccDrawerNext] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [totalFiltersCount, setTotalFiltersCount] = useState(0);
  const [filterKeys, setFilterKeys] = useState('');
  const [createAccObj, setCreateAccObj] = useState({
    companyName: '',
    companyType: '',
    companySize: '',
    email: '',
    potentialEarnings: '',
    employersAgencyType: '',
  });
  const [activeSearchKey, setActiveSearchKey] = useState({
    searchId: '',
  });
  const [employersAgencyType, setEmployersAgencyType] =
    useState(employerDetails);
  const [createAccErr, setCreateAccErr] = useState();
  const [isCalculateEarningsVisible, setIsCalculateEarningsVisible] =
    useState(false);
  const [referralPerPerson, setReferralPerPerson] =
    useState(DEFAULT_REF_BRANCH);

  const [subscriptionDrawerOpen, setSubscriptionDrawerOpen] = useState(false);

  const {
    employerTypeCheckboxes,
    employerVerificationCheckboxes,
    employerActivationCheckBoxes,
    handleEmployerTypeCheckboxeChange,
    handleEmployerActivationCheckboxChange,
    handleEmployerVerificationCheckboxChange,
    handleApplyClick,
    clearFilters,
  } = useEmployerFilter(
    setTotalFiltersCount,
    setFilterKeys,
    setOpenFilterDrawer,
    navigate,
    searchParams,
    setCurrentPage,
  );

  const { data: subscriptionData } = useGetSubscriptionData();

  const filterCheckboxes = [
    {
      fieldType: 'filter',
      filterHeader: 'Type',
      headerWeight: '500',
      checkboxes: employerTypeCheckboxes,
      handleCheckboxChange: handleEmployerTypeCheckboxeChange,
      filterClassname: { justifyContent: 'space-between' },
    },
    {
      fieldType: 'filter',
      filterHeader: 'Verification',
      headerWeight: '500',
      checkboxes: employerVerificationCheckboxes,
      handleCheckboxChange: handleEmployerVerificationCheckboxChange,
      filterClassname: { justifyContent: 'space-between' },
    },
    {
      fieldType: 'filter',
      filterHeader: 'Activation',
      headerWeight: '500',
      checkboxes: employerActivationCheckBoxes,
      handleCheckboxChange: handleEmployerActivationCheckboxChange,
      filterClassname: { gap: '260px' },
    },
  ];
  const {
    data: allEmployerData,
    isLoading: allEmployerDataLoading,
    isFetching: allEmployerDataFetching,
    refetch: refetchAllEmployer,
  } = useGetAllEmployer({
    searchId: activeSearchKey?.searchId,
    currentPage,
    itemsPerPage,
    filterKeys,
  });

  const {
    mutate: postAddEmployerMutate,
    status: postAddEmployerStatus,
    error: postAddEmployerError,
  } = usePostAddEmployer();

  const handleCreateAccount = () => {
    setIsCalculateEarningsVisible(true);
  };

  useEffect(() => {
    setTotalItems(allEmployerData?.totalAgencies || 10);
  }, [allEmployerData]);

  useEffect(() => {
    if (postAddEmployerStatus === 'success') {
      setReferralPerPerson(DEFAULT_REF_BRANCH);
      setIsCalculateEarningsVisible(false);
      setOpenCreateAccDrawerNext(false);
      setOpenSelectEmpAgencyDrawer(false);
      refetchAllEmployer();
      setCreateAccObj({});
      setCreateAccErr();
      clearFields();
      enqueueSnackbar('Employer added successfully', {
        variant: 'success',
      });
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
      setIsCalculateEarningsVisible(false);
      setReferralPerPerson(DEFAULT_REF_BRANCH);
      // setOpenCreateAccDrawerNext(false);
      refetchAllEmployer();
      setCreateAccObj({});
      setCreateAccErr();
      clearFields();
    }
  }, [postAddEmployerStatus]);

  const handleCreateNewAccount = (potentialEarnings) => {
    const companyType = companyTypeMap[createAccObj.companyType];
    const payload = {
      userContact: {
        email: createAccObj.email,
      },
      sourceType: 'OPS',
      companyType: companyType,
      companySize: createAccObj.companySize,
      userType: 'STAFFING_AGENCY',
      employersAgencyType: createAccObj.employersAgencyType,
      password: generateRandomString(),
      name: createAccObj.companyName,
      potentialEarnings: potentialEarnings,
    };
    postAddEmployerMutate(payload);
  };

  const clearFields = () => {
    setCreateAccObj({
      companyName: '',
      companyType: '',
      companySize: '',
      email: '',
    });
    setCreateAccErr();
  };

  const handleNewAccountClick = () => {
    clearFields();
    setOpenSelectEmpAgencyDrawer(true);
  };

  const handleOpenCreateAccountModal = () => {
    // clearFields();
    setIsCalculateEarningsVisible(false);
    setOpenCreateAccDrawer(false);
    setOpenCreateAccDrawerNext(true);
  };

  const headerKeys = Array.from(
    employerTableHeadersData.map((item) => item.key),
  );

  function createData(userDetails) {
    return headerKeys?.map((item) => {
      if (item === 'noOfStaffingAgencyCustomers') {
        return userDetails[item] && userDetails[item] !== 0
          ? userDetails[item]
          : '---';
      }
      if (item === 'companySize') {
        return userDetails[item] && userDetails[item] !== 0
          ? userDetails[item]
          : 0;
      }
      return userDetails[item] ?? '---';
    });
  }

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
      searchParams.set('itemsPerPage', pageSize);
      searchParams.set('currentPage', 1);

      const queryString = generateSearchParams(searchParams);
      navigate(`/employers?${queryString}`, { replace: true });
    }
  };

  const handleSearchById = () => {
    setCurrentPage(1);
    setActiveSearchKey({ searchId });
    if (!!searchId) {
      searchParams.set('searchId', searchId);
    }
    if (!searchId) {
      searchParams.delete('searchId');
    }
    searchParams.set('currentPage', 1);
    const queryString = generateSearchParams(searchParams);
    navigate(`/employers?${queryString}`, { replace: true });
  };

  const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
      handleSearchById();
    }
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    const employerId = employerData[actionIndex]?._id;

    navigate(`/employers/${employerId}`);
  };

  const handleRowClick = (index) => {
    const employerId = employerData[index]?._id;
    navigate(`/employers/${employerId}`);
  };

  const handleAddCreditPaymentClick = (e) => {
    e.stopPropagation();
    const employerId = employerData[actionIndex]?._id;
    setSubscriptionDrawerOpen(true);
  };

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search with ID/Name/Brand Name',
      width: '260px',
      setInput: setSearchID,
      enteredInput: searchId,
    },
  ];
  const arrBtn = [
    {
      text: 'View Details',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#586276',
      onClick: handleViewDetailsClick,
      permission: PAGE_PERMISSIONS?.VIEW_EMPLOYER_DETAILS,
    },
    {
      text: 'Add credit payment',
      icon: ICONS.GREY_PLUS,
      active: true,
      isVisible: !!subscriptionData,
      color: '#586276',
      onClick: handleAddCreditPaymentClick,
      permission: PAYMENT_PERMISSIONS?.EMPLOYER_CREDITS_PAYMENT,
    },
  ];
  useEffect(() => {
    let searchId = '';
    if (searchParams.get('searchId')) {
      setSearchID(searchParams.get('searchId'));
      searchId = searchParams.get('searchId');
    }
    if (!searchParams.get('searchId')) {
      setSearchID('');
      searchId = '';
    }
    setActiveSearchKey({ searchId });
    setCurrentPage(Number(searchParams.get('currentPage')) || 1);
    setItemsPerPage(Number(searchParams.get('itemsPerPage')) || 10);
  }, []);
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

  useEffect(() => {
    if (!allEmployerDataLoading) {
      setEmployerTableHeadersData(allEmployerData?.headers || []);
      setEmployerData(allEmployerData?.response || []);
      setTotalEmployer(allEmployerData?.totalAgencies || 0);
    }
  }, [allEmployerDataLoading, allEmployerDataFetching, allEmployerData]);

  const tableHeaders = Array.from(
    employerTableHeadersData.map((item) => item.value),
  );
  const headerTypes = Array.from(
    employerTableHeadersData.map((item) =>
      item.key === 'employersAgencyType' ? 'AGENCY' : item.type,
    ),
  );

  const rows = Array.from(employerData.map((item) => createData(item)));

  if (isCalculateEarningsVisible) {
    return (
      <CalculateEarnings
        createAccObj={createAccObj}
        handleOpenCreateAccountModal={handleOpenCreateAccountModal}
        setIsCalculateEarningsVisible={setIsCalculateEarningsVisible}
        setOpenCreateAccDrawer={setOpenCreateAccDrawer}
        setCreateAccObj={setCreateAccObj}
        openCreateAccDrawer={openCreateAccDrawer}
        setCreateAccErr={setCreateAccErr}
        referralPerPerson={referralPerPerson}
        setReferralPerPerson={setReferralPerPerson}
      />
    );
  }

  return (
    <Wrapper>
      <Top>
        <HeaderWrap>
          <Header>
            <HeaderTitle>All Account</HeaderTitle>
            <HeaderDesc>{`Total: ${totalEmployer}`}</HeaderDesc>
          </Header>
          <HeaderRight>
            {' '}
            <CustomCTA
              onClick={() => setOpenFilterDrawer(true)}
              url={ICONS.FILTER}
              title={`Filter (${totalFiltersCount ?? ''})`}
              showIcon={true}
              bgColor={'#677995'}
              color={'#FFF'}
              border={'none'}
              fontSize={'12px'}
              gap={'12px'}
            />
            <CustomCTA
              onClick={handleNewAccountClick}
              title={'New Account'}
              showIcon={true}
              color={'#FFF'}
              bgColor={'#141482'}
              border={'1px solid #CDD4DF'}
              isPermitted={hasPermission(
                EMPLOYER_MODULE_PERMISSIONS?.UPDATE_EMPLOYERS,
              )}
            />
          </HeaderRight>
        </HeaderWrap>
        <Suspense>
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
                showIcon={false}
                color={'#FFF'}
                bgColor={'#141482'}
                isLoading={allEmployerDataLoading}
                border={'1px solid #CDD4DF'}
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
          <Details>
            <TableDiv>
              {!(allEmployerDataLoading || allEmployerDataFetching) ? (
                <DisplayTable
                  tableId={'employersTable'}
                  rows={rows}
                  headers={tableHeaders}
                  headersType={headerTypes}
                  showActionsPanel={showActionsPanel}
                  arrBtn={arrBtn}
                  actionIndex={actionIndex}
                  setActionIndex={setActionIndex}
                  actionOpen={actionOpen}
                  setActionOpen={setActionOpen}
                  tableData={employers}
                  arrBtnRight={'80px'}
                  onClickFn={handleRowClick}
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
            pageType={'employers'}
          />
          <CreateAccDrawer
            open={openCreateAccDrawer}
            toggleDrawer={setOpenCreateAccDrawer}
            handleCreateAccount={handleCreateAccount}
            createAccObj={createAccObj}
            createAccErr={createAccErr}
            setCreateAccObj={setCreateAccObj}
            setCreateAccErr={setCreateAccErr}
            setIsCalculateEarningsVisible={setIsCalculateEarningsVisible}
            employersAgencyType={employersAgencyType}
            setEmployersAgencyType={setEmployersAgencyType}
          />
          <SelectEmpAgencyDrawer
            open={openSelectEmpAgencyDrawer}
            toggleDrawer={setOpenSelectEmpAgencyDrawer}
            createAccObj={createAccObj}
            createAccErr={createAccErr}
            setCreateAccObj={setCreateAccObj}
            setCreateAccErr={setCreateAccErr}
            employersAgencyType={employersAgencyType}
            setEmployersAgencyType={setEmployersAgencyType}
            employerDetails={employerDetails}
            setOpenCreateAccDrawer={setOpenCreateAccDrawer}
          />
          <CreateAccDrawerNext
            open={openCreateAccDrawerNext}
            toggleDrawer={setOpenCreateAccDrawerNext}
            handleCreateNewAccount={handleCreateNewAccount}
            createAccObj={createAccObj}
            createAccErr={createAccErr}
            setCreateAccObj={setCreateAccObj}
            setCreateAccErr={setCreateAccErr}
            setIsCalculateEarningsVisible={setIsCalculateEarningsVisible}
            referralPerPerson={referralPerPerson}
          />
          <FilterDrawer
            open={openFilterDrawer}
            toggleDrawer={setOpenFilterDrawer}
            totalFiltersCount={totalFiltersCount}
            handleApplyClick={handleApplyClick}
            clearFilters={clearFilters}
            filterCheckboxes={filterCheckboxes}
          />
          <SubsciptionDrawer
            open={subscriptionDrawerOpen}
            toggleDrawer={setSubscriptionDrawerOpen}
            employerData={employerData[actionIndex]}
            subscriptionData={subscriptionData}
          />
        </Suspense>
      </Bottom>
    </Wrapper>
  );
};

export default Employers;
