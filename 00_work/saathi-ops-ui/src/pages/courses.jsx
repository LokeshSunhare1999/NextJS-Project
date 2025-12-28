import './../App.css';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import {
  useDeleteCourse,
  useGetAllCourses,
  usePostAddCourse,
  useGetGlobalData,
  useGetGlobalDataByName,
  usePutUser,
} from '../apis/queryHooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { COURSE_MODULE, languageData } from '../constants';
import {
  inputRangeCheck,
  textLengthCheck,
  downloadCSV,
  generateSearchParams,
} from '../utils/helper';
import Skeleton from '@mui/material/Skeleton';
import ICONS from '../assets/icons';
import styleComponents from '../style/pageStyle';
import styled from 'styled-components';
import { COURSE_MODULE_PERMISSIONS } from '../constants/permissions';
import usePermission from '../hooks/usePermission';
import useDeviceType from '../hooks/useDeviceType';
import DrawerInput from '../components/common/DrawerInput';
import { parseCookies } from 'nookies';

const GlobalPop = lazy(() => import('../components/GlobalPop'));
const AddCourseDrawer = lazy(
  () => import('../components/courses/AddCourseDrawer'),
);
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

const Courses = () => {
  const deviceType = useDeviceType();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cookies = parseCookies();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseHeaders, setCourseHeaders] = useState([]);
  const [courseObj, setCourseObj] = useState({
    ...COURSE_MODULE?.COURSE_OBJ_STRUCTURE,
  });
  const [courseObjError, setCourseObjError] = useState({
    ...COURSE_MODULE?.COURSE_OBJ_ERROR_STRUCTURE,
  });

  const [courseId, setCourseId] = useState('');
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [category, setCategory] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDropdownBottom, setOpenDropdownBottom] = useState(false);
  const firstUpdate = useRef(true);
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    sessionStorage?.getItem('selectedLanguage') || 'en',
  );
  const isMounted = useRef(false);
  const { hasPermission } = usePermission();
  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
    }
  };

  const {
    data: allCoursesData,
    isLoading: isGetAllCoursesLoading,
    isFetching: isGetAllCoursesFetching,
    refetch: refetchAllCourses,
    status: getAllCourses,
    isError: isGetAllCoursesErr,
    error: getAllCoursesErr,
  } = useGetAllCourses({
    currentPage,
    itemsPerPage,
    courseTitle: courseTitle || searchParams.get('courseTitle'),
    category: category || searchParams.get('category'),
    langCode: selectedLanguage,
  });

  const { data: globalData } = useGetGlobalData();
  // const { data: languageData } = useGetGlobalDataByName('LANGUAGES');

  const { mutateAsync: putUserMutate, status: putUserStatus } = usePutUser(
    cookies?.userId,
  );

  const {
    mutate: addCourseMutation,
    status: addCourseStatus,
    isError: isAddCourseErr,
    error: addCourseErr,
  } = usePostAddCourse();

  const {
    mutate: deleteCourseMutation,
    status: deleteCourseStatus,
    isError: isDeleteCourseErr,
    error: deleteCourseErr,
  } = useDeleteCourse();

  function createData(courseDetails) {
    const headerKeys = Array.from(courseHeaders?.map((item) => item.key));
    return headerKeys?.map((item) => courseDetails[item]);
  }

  function createTooltipArray(courses) {
    const toolTipArray = [];

    courses?.forEach((course, index) => {
      const toolTipObj = [];

      if (course?.noModuleAdded) {
        toolTipObj.push('No module added');
      }

      if (course?.noSubmoduleAdded) {
        toolTipObj.push('No submodule added');
      } else if (!course?.noModuleAdded && !course?.noSubmoduleAdded) {
        if (course?.totalPendingVideos > 0) {
          toolTipObj.push(`${course?.totalPendingVideos} pending videos`);
        }

        if (course?.totalPendingAssesments > 0) {
          toolTipObj.push(
            `${course?.totalPendingAssesments} pending assessments`,
          );
        }

        if (course?.pendingThumbnails > 0) {
          toolTipObj.push(`${course?.pendingThumbnails} pending thumbnails`);
        }
      }

      toolTipArray[index] = toolTipObj;
    });

    return toolTipArray;
  }

  useEffect(() => {
    if (!isGetAllCoursesLoading || !isGetAllCoursesFetching) {
      setCourses(allCoursesData?.courses);
      setCourseHeaders(allCoursesData?.headers);
      setTotalItems(allCoursesData?.totalCourses);
    }
  }, [isGetAllCoursesLoading, isGetAllCoursesFetching, allCoursesData]);

  useEffect(() => {
    if (addCourseStatus === 'success') {
      refetchAllCourses();
      setOpenDrawer(false);
      setCourseObj({ ...COURSE_MODULE?.COURSE_OBJ_STRUCTURE });
      enqueueSnackbar('Course added successfully !', {
        variant: 'success',
      });
    } else if (addCourseStatus === 'error') {
      enqueueSnackbar(
        `Failed to add course. error : ${addCourseErr?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [addCourseStatus]);

  useEffect(() => {
    if (deleteCourseStatus === 'success') {
      refetchAllCourses();
      enqueueSnackbar('Course deleted successfully !', {
        variant: 'success',
      });
    } else if (deleteCourseStatus === 'error') {
      enqueueSnackbar(`Error in course delete. ${deleteCourseErr?.message}`, {
        variant: 'error',
      });
    }
  }, [deleteCourseStatus]);

  const downloadTemplate = async () => {
    try {
      const response = await fetch('./course-template.csv');
      const csvText = await response.text();
      downloadCSV(csvText, 'template.csv');
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const handleRowClick = (index) => {
    navigate(`/courses/${courses[index]?._id}`);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    navigate(`/courses/${courses[actionIndex]?._id}`);
  };

  const handleDelete = () => {
    setOpenDeletePop(false);
    deleteCourseMutation(courseId);
  };

  const handleDeleteClick = (index) => {
    setOpenDeletePop(true);
    setCourseId(courses[index]?._id);
  };

  const handleAddCourse = () => {
    const errorFields = {
      courseTitle: textLengthCheck(
        courseObj?.courseTitle,
        COURSE_MODULE?.TITLE_MAX_LENGTH,
      ),
      courseDescription: textLengthCheck(
        courseObj?.courseDescription,
        COURSE_MODULE?.DESCRIPTION_MAX_LENGTH,
      ),
      courseCategory: textLengthCheck(courseObj?.courseCategory),
      coursePrice: inputRangeCheck(
        courseObj?.price?.coursePrice,
        COURSE_MODULE?.COURSE_PRICE_MAX,
      ),
      displayPrice: inputRangeCheck(
        courseObj?.price?.displayPrice,
        COURSE_MODULE?.DISPLAY_PRICE_MAX,
      ),
      salaryBenefit: textLengthCheck(
        courseObj?.salaryBenefit,
        COURSE_MODULE?.DESCRIPTION_MAX_LENGTH,
      ),
    };
    if (
      JSON.stringify(errorFields) ===
      JSON.stringify(COURSE_MODULE?.COURSE_OBJ_ERROR_STRUCTURE)
    ) {
      addCourseMutation(courseObj);
    } else {
      setCourseObjError({
        ...courseObjError,
        ...errorFields,
      });
    }
  };

  const clearFields = () => {
    setCourseObj({ ...COURSE_MODULE?.COURSE_OBJ_STRUCTURE });
    setCourseObjError({ ...COURSE_MODULE?.COURSE_OBJ_ERROR_STRUCTURE });
  };

  const handleDeleteBtn = (e) => {
    e.stopPropagation();
    // setActionOpen(false);
    handleDeleteClick(actionIndex);
  };

  const handleSearchByTitle = () => {
    setCurrentPage(1);
    refetchAllCourses();

    if (!!courseTitle) {
      searchParams.set('courseTitle', courseTitle);
    } else {
      searchParams.delete('courseTitle');
    }
    if (!!category) {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    searchParams.set('currentPage', 1);

    const queryString = generateSearchParams(searchParams);
    navigate(`/courses?${queryString}`, { replace: true });
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
    const langData = languageData?.find(
      (item) => item?.language === language,
    );
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
  useEffect(() => {
    if (searchParams.get('courseTitle')) {
      setCourseTitle(searchParams.get('courseTitle'));
    }
    if (!searchParams.get('courseTitle')) {
      setCourseTitle('');
    }
    if (searchParams.get('category')) {
      setCategory(searchParams.get('category'));
    }
    if (!searchParams.get('category')) {
      setCategory('');
    }
    setCurrentPage(Number(searchParams.get('currentPage')) || 1);
    setItemsPerPage(Number(searchParams.get('itemsPerPage')) || 10);
  }, []);

  useEffect(() => {
    refetchAllCourses();
  }, [selectedLanguage]);

  const arrBtn = [
    {
      text: 'View',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleViewClick,
      permission: COURSE_MODULE_PERMISSIONS.VIEW_COURSE,
    },
    {
      text: 'Delete',
      icon: ICONS.DELETE_ICON,
      active: true,
      isVisible: true,
      color: '#DD4141',
      onClick: handleDeleteBtn,
      permission: COURSE_MODULE_PERMISSIONS.DELETE_COURSE,
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

  const COURSE_CATEGORIES = globalData?.['EMPLOYMENT_TYPES'] || [];
  const activeLanguage = languageData?.find(
    (item) => item?.langCode === selectedLanguage,
  )?.language;

  return (
    <Wrapper $deviceType={deviceType}>
      <Top>
        <HeaderWrap $alignItems={'start'}>
          <HeaderTitle>
            All Courses
            <HeaderDesc>
              Total Courses: {allCoursesData?.totalCourses}
            </HeaderDesc>
          </HeaderTitle>{' '}
          <HeaderRight>
            <Suspense>
              <CustomCTA
                onClick={downloadTemplate}
                title={'Download Template'}
                showIcon={true}
                color={'#141482'}
                bgColor={'#ffffff'}
                border={'1px solid #141482'}
                url={ICONS.DOWNLOAD}
                isPermitted={hasPermission(
                  COURSE_MODULE_PERMISSIONS?.DOWNLOAD_TEMPLATE,
                )}
              />
              <CustomCTA
                onClick={() => setOpenDrawer(true)}
                title={'Add Courses'}
                showIcon={true}
                color={'#FFF'}
                bgColor={'#141482'}
                border={'1px solid #CDD4DF'}
                isPermitted={hasPermission(
                  COURSE_MODULE_PERMISSIONS?.ADD_COURSE,
                )}
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
            <SearchBox>
              <SearchFilter
                searchArr={searchArr}
                isFilter={true}
                title={'Course category'}
                setCategory={setCategory}
                category={category}
                listItem={['All Category', ...COURSE_CATEGORIES]}
                onKeyPress={handleEnterButton}
                isScrollable={true}
              />
              <CustomCTA
                onClick={handleSearchByTitle}
                title={'Search'}
                showIcon={false}
                color={'#FFF'}
                bgColor={'#141482'}
                isLoading={isGetAllCoursesFetching}
                border={'1px solid #CDD4DF'}
              />
            </SearchBox>
            <DrawerInput
              fieldType={'dropdown'}
              showFieldHeader={false}
              fieldValue={activeLanguage || `Select user's active language`}
              handleDropDownSelect={handleLanguageSelect}
              dropDownList={languageData?.map(
                (item) => item?.language,
              )}
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
            />
          </TopPageWrap>
          <Details>
            {' '}
            {courseHeaders?.length > 0 ? (
              <TableDiv>
                <DisplayTable
                  tableId={'courses'}
                  rows={Array.from(courses?.map((item) => createData(item)))}
                  headers={Array.from(courseHeaders?.map((item) => item.value))}
                  headersType={Array.from(
                    courseHeaders?.map((item) => item.type),
                  )}
                  showActionsPanel={showActionsPanel}
                  onClickFn={handleRowClick}
                  arrBtn={arrBtn}
                  actionIndex={actionIndex}
                  setActionIndex={setActionIndex}
                  actionOpen={actionOpen}
                  setActionOpen={setActionOpen}
                  toolTipArray={createTooltipArray(courses)}
                  arrBtnRight={'80px'}
                />
              </TableDiv>
            ) : null}
          </Details>
        </Suspense>
      </Top>

      <Suspense fallback={<div></div>}>
        <AddCourseDrawer
          open={openDrawer}
          toggleDrawer={setOpenDrawer}
          handleAddCourse={handleAddCourse}
          courseObj={courseObj}
          setCourseObj={setCourseObj}
          clearFields={clearFields}
          courseObjError={courseObjError}
          setCourseObjError={setCourseObjError}
          courseCategoryList={globalData?.['EMPLOYMENT_TYPES']}
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
          />
        </Suspense>
      </Bottom>
    </Wrapper>
  );
};

export default Courses;
