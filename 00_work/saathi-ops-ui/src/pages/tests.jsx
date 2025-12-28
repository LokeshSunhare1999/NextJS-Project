import './../App.css';
import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import {
  usePostAddTest,
  useGetAllTests,
  usePutDeleteTest,
  useGetTestCategories,
  usePutUser,
} from '../apis/queryHooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { inputRangeCheck, textLengthCheck, downloadCSV } from '../utils/helper';
import Skeleton from '@mui/material/Skeleton';
import ICONS from '../assets/icons';
import { generateSearchParams } from '../utils/helper';
import styleComponents from '../style/pageStyle';
import styled from 'styled-components';
import {
  CERTIFICATE_BENEFIT_STRUCTURE,
  MEDAL_BENEFIT_STRUCTURE,
  TEST_MODULE,
} from '../constants/tests';
import { languageData } from '../constants';
import usePermission from '../hooks/usePermission';
import { TEST_MODULE_PERMISSIONS } from '../constants/permissions';
import useDeviceType from '../hooks/useDeviceType';
import DrawerInput from '../components/common/DrawerInput';
import { parseCookies } from 'nookies';
const GlobalPop = lazy(() => import('../components/GlobalPop'));
const AddTestDrawer = lazy(() => import('../components/tests/AddTestDrawer'));
const SearchFilter = lazy(() => import('../components/SearchFilter'));
const DisplayTable = lazy(() => import('../components/DisplayTable'));
const CustomCTA = lazy(() => import('../components/CustomCTA'));
const Pagination = lazy(
  () => import('../components/atom/tableComponents/Pagination'),
);

const {
  Wrapper,
  Top,
  Bottom,
  HeaderWrap,
  HeaderTitle,
  HeaderDesc,
  SearchDiv,
  SearchBox,
  AnimatedBox,
  Details,
  HeaderRight,
  TopPageWrap,
} = styleComponents();

const TableDiv = styled.div`
  position: relative;
`;

const Tests = () => {
  const deviceType = useDeviceType();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const isMounted = useRef(false);
  const [searchParams] = useSearchParams();
  const cookies = parseCookies();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [testObj, setTestObj] = useState({
    ...TEST_MODULE?.TEST_OBJ_STRUCTURE,
  });
  const [testObjError, setTestObjError] = useState({
    ...TEST_MODULE?.TEST_OBJ_ERROR_STRUCTURE,
  });
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [category, setCategory] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDropdownBottom, setOpenDropdownBottom] = useState(false);
  const [categoryCheckboxes, setCategoryCheckboxes] = useState([]);
  const [skillsCheckboxes, setSkillsCheckboxes] = useState([]);
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(
    sessionStorage?.getItem('selectedLanguage') || 'en',
  );
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
      searchParams.set('itemsPerPage', pageSize);
      searchParams.set('currentPage', 1);
      const queryString = generateSearchParams(searchParams);
      navigate(`/tests?${queryString}`, { replace: true });
    }
  };

  const { data: allTestsData, refetch: refetchAllTests } = useGetAllTests({
    currentPage,
    itemsPerPage,
    langCode: selectedLanguage,
  });

  const { mutateAsync: putUserMutate, status: putUserStatus } = usePutUser(
    cookies?.userId,
  );

  const testHeaders = allTestsData?.headers?.map((item) => item.value);

  const testHeaderTypes = allTestsData?.headers?.map((item) => item.type);

  useEffect(() => {
    setTotalItems(allTestsData?.totalTests || 0);
  }, [allTestsData]);

  const { data: testCategoriesData } = useGetTestCategories();

  const { mutate: addTestMutate, status: addTestStatus } = usePostAddTest();

  const { mutate: deleteTestMutate, status: deleteTestStatus } =
    usePutDeleteTest();

  function createData(courseDetails) {
    const headerKeys = Array.from(
      allTestsData?.headers?.map((item) => item.key),
    );
    return headerKeys?.map((item) => courseDetails[item]);
  }

  useEffect(() => {
    if (addTestStatus === 'success') {
      refetchAllTests();
      setOpenDrawer(false);
      setTestObj({ ...TEST_MODULE?.TEST_OBJ_STRUCTURE });
      enqueueSnackbar('Test added successfully !', {
        variant: 'success',
      });
    } else if (addTestStatus === 'error') {
      enqueueSnackbar(`Failed to add test.`, {
        variant: 'error',
      });
    }
  }, [addTestStatus]);

  useEffect(() => {
    if (deleteTestStatus === 'success') {
      refetchAllTests();
      enqueueSnackbar('Test deleted successfully !', {
        variant: 'success',
      });
    } else if (deleteTestStatus === 'error') {
      enqueueSnackbar(`Error in test delete.`, {
        variant: 'error',
      });
    }
  }, [deleteTestStatus]);

  useEffect(() => {
    const updatedCheckboxes = [];
    const updatedSkillsCheckboxes = [];
    testCategoriesData?.testCategories?.map((item) =>
      updatedCheckboxes.push({
        key: item?.employmentType,
        value: item?.employmentName,
        checked: false,
      }),
    );
    testCategoriesData?.testSkills?.map((item) =>
      updatedSkillsCheckboxes.push({
        key: item,
        value: item,
        checked: false,
      }),
    );
    setCategoryCheckboxes(updatedCheckboxes);
    setSkillsCheckboxes(updatedSkillsCheckboxes);
    setTestObj({
      ...testObj,
      certificateBenefits: CERTIFICATE_BENEFIT_STRUCTURE,
      medalBenefits: MEDAL_BENEFIT_STRUCTURE,
    });
  }, [testCategoriesData]);

  const handleRowClick = (index) => {
    navigate(`/tests/${allTestsData?.tests?.[index]?._id}`);
  };

  const handleDelete = () => {
    setOpenDeletePop(false);
    deleteTestMutate(allTestsData?.tests?.[actionIndex]?._id);
  };

  const handleDeleteClick = () => {
    setOpenDeletePop(true);
  };

  const handleAddTest = () => {
    const errorFields = {
      testName: textLengthCheck(
        testObj?.testName,
        TEST_MODULE?.TITLE_MAX_LENGTH,
      ),
      // testDescription: textLengthCheck(
      //   testObj?.testDescription,
      //   TEST_MODULE?.DESCRIPTION_MAX_LENGTH,
      // ),
      testCategory: !categoryCheckboxes?.some((item) => item.checked),
      testSkills: !skillsCheckboxes?.some((item) => item.checked),
      actualPrice: inputRangeCheck(
        testObj?.testPricing?.actualPrice,
        TEST_MODULE?.ACTUAL_PRICE_MAX,
      ),
      displayPrice: inputRangeCheck(
        testObj?.testPricing?.displayPrice,
        TEST_MODULE?.DISPLAY_PRICE_MAX,
      ),
      // salaryBenefits: textLengthCheck(
      //   testObj?.salaryBenefits,
      //   TEST_MODULE?.DESCRIPTION_MAX_LENGTH,
      // ),
      salaryRange: textLengthCheck(
        testObj?.salaryRange,
        TEST_MODULE?.DESCRIPTION_MAX_LENGTH,
      ),
    };
    if (
      JSON.stringify(errorFields) ===
      JSON.stringify(TEST_MODULE?.TEST_OBJ_ERROR_STRUCTURE)
    ) {
      const categoryArr = categoryCheckboxes?.filter((item) => {
        return item.checked;
      });
      const skillArr = skillsCheckboxes?.filter((item) => {
        return item.checked;
      });
      addTestMutate({
        ...testObj,
        testCategory: categoryArr?.map((item) => item.key),
        testSkills: skillArr?.map((item) => item.key),
      });
    } else {
      setTestObjError({
        ...testObjError,
        ...errorFields,
      });
    }
  };

  const clearFields = () => {
    const updatedCheckboxes = [];
    const updatedSkillsCheckboxes = [];
    testCategoriesData?.testCategories?.map((item) =>
      updatedCheckboxes.push({
        key: item?.key,
        value: item?.displayName,
        checked: false,
      }),
    );
    testCategoriesData?.testSkills?.map((item) =>
      updatedSkillsCheckboxes.push({
        key: item,
        value: item,
        checked: false,
      }),
    );
    setSkillsCheckboxes(updatedSkillsCheckboxes);
    setCategoryCheckboxes(updatedCheckboxes);
    setTestObj({ ...TEST_MODULE?.TEST_OBJ_STRUCTURE });
    setTestObjError({ ...TEST_MODULE?.TEST_OBJ_ERROR_STRUCTURE });
  };

  const handleDeleteBtn = (e) => {
    e.stopPropagation();
    // setActionOpen(false);
    handleDeleteClick(actionIndex);
  };

  const handleSearchByTitle = () => {
    setCurrentPage(1);
    // refetchAllCourses();
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
    setOpenDropdownBottom(!openDropdownBottom);
  };

  const handleDropdownBottom = () => {
    setOpenDropdownBottom(!openDropdownBottom);
    setOpenDropdown(!openDropdown);
  };

  const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
      handleSearchByTitle();
    }
  };

  const handleLanguageSelect = (language) => {
    const langData = languageData?.find((item) => item?.language === language);
    putUserMutate({
      langCode: langData?.langCode,
      initial: langData?.initial,
      language: langData?.language,
    })
      .then((response) => {
        setIsLanguageDropdownOpen(false);
        setSelectedLanguage(response?.langCode);
        sessionStorage.setItem('selectedLanguage', response?.langCode || 'en');
        enqueueSnackbar('Language updated successfully!', {
          variant: 'success',
        });
      })
      .catch((error) => {
        setIsLanguageDropdownOpen(false);
        enqueueSnackbar('Failed to update language!', {
          variant: 'error',
        });
      });
  };

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search by Course Title',
      width: '170px',
      setInput: setCourseTitle,
      enteredInput: courseTitle,
    },
  ];

  const arrBtn = [
    {
      text: 'Delete',
      icon: ICONS.DELETE_ICON,
      active: true,
      isVisible: true,
      color: '#DD4141',
      onClick: handleDeleteBtn,
      permission: TEST_MODULE_PERMISSIONS?.DELETE_TEST,
    },
  ];
  useEffect(() => {
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
    refetchAllTests();
  }, [selectedLanguage]);

  const activeLanguage = languageData?.find(
    (item) => item?.langCode === selectedLanguage,
  )?.language;

  return (
    <Wrapper $deviceType={deviceType}>
      <Top>
        <HeaderWrap $alignItems={'start'}>
          <HeaderTitle>
            All Tests
            <HeaderDesc>Total Tests: {totalItems}</HeaderDesc>
          </HeaderTitle>{' '}
          <HeaderRight>
            <Suspense>
              <CustomCTA
                onClick={() => setOpenDrawer(true)}
                title={'Add Test'}
                showIcon={true}
                color={'#FFF'}
                bgColor={'#141482'}
                border={'1px solid #CDD4DF'}
                isPermitted={hasPermission(TEST_MODULE_PERMISSIONS?.ADD_TEST)}
              />
            </Suspense>
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
          <SearchDiv>
            <div />
            <DrawerInput
              fieldType={'dropdown'}
              showFieldHeader={false}
              fieldValue={activeLanguage || `Select user's active language`}
              handleDropDownSelect={handleLanguageSelect}
              dropDownList={languageData?.map((item) => item?.language)}
              dropDownOpen={isLanguageDropdownOpen}
              handleDropDownOpen={setIsLanguageDropdownOpen}
            />
          </SearchDiv>
          <TopPageWrap>
            <Pagination
              isBackground={false}
              onShowSizeChange={onShowSizeChange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              setTotalItems={setTotalItems}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              arrowBg={'#fff'}
              isFlexColumn={true}
              isBottom={false}
              setOpenDropdown={setOpenDropdown}
              openDropdown={openDropdown}
              handleDropdown={handleDropdown}
              searchParams={searchParams}
              navigate={navigate}
              pageType={'tests'}
            />
          </TopPageWrap>
          <Details>
            {' '}
            {allTestsData?.headers?.length > 0 ? (
              <TableDiv>
                <DisplayTable
                  tableId={'tests'}
                  rows={Array.from(
                    allTestsData?.tests?.map((item) => createData(item)),
                  )}
                  headers={testHeaders}
                  headersType={testHeaderTypes}
                  showActionsPanel={showActionsPanel}
                  onClickFn={handleRowClick}
                  arrBtn={arrBtn}
                  actionIndex={actionIndex}
                  setActionIndex={setActionIndex}
                  actionOpen={actionOpen}
                  setActionOpen={setActionOpen}
                  //   toolTipArray={createTooltipArray(courses)}
                  arrBtnRight={'80px'}
                />
              </TableDiv>
            ) : null}
          </Details>
        </Suspense>
      </Top>

      <Suspense fallback={<div></div>}>
        <AddTestDrawer
          open={openDrawer}
          toggleDrawer={setOpenDrawer}
          handleAddTest={handleAddTest}
          testObj={testObj}
          setTestObj={setTestObj}
          clearFields={clearFields}
          testObjError={testObjError}
          setTestObjError={setTestObjError}
          testStatus={addTestStatus}
          categoryCheckboxes={categoryCheckboxes}
          skillsCheckboxes={skillsCheckboxes}
          setCategoryCheckboxes={setCategoryCheckboxes}
          setSkillsCheckboxes={setSkillsCheckboxes}
        />
      </Suspense>
      {openDeletePop && (
        <Suspense fallback={<div></div>}>
          <GlobalPop
            setOpenDeletePop={setOpenDeletePop}
            title={'Delete File'}
            heading={'Are you sure want to delete this file?'}
            subHeading={'This action is permanent and cannot be undone.'}
            handleDelete={handleDelete}
          />
        </Suspense>
      )}
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
            setOpenDropdown={setOpenDropdownBottom}
            openDropdown={openDropdownBottom}
            handleDropdown={handleDropdownBottom}
            searchParams={searchParams}
            navigate={navigate}
            pageType={'tests'}
          />
        </Suspense>
      </Bottom>
    </Wrapper>
  );
};

export default Tests;
