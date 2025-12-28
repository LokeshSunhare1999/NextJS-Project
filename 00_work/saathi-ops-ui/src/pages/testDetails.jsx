import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import detailsPageStyle from '../style/detailsPageStyle';
import ICONS from '../assets/icons';
import {
  useGetTestDetails,
  usePostUploadTestCsv,
  usePutEditTest,
  usePutUpdateTestAssessment,
  useGetTestCategories,
} from '../apis/queryHooks';
import PageHeader from '../components/courseDetail/PageHeader';
import Description from '../components/courseDetail/Description';
import CourseDetailsHeader from '../components/courseDetail/CourseDetailsHeader';
import ActionButton from '../components/ActionButton';
import Skeleton from '@mui/material/Skeleton';
import { TEST_MODULE } from '../constants/tests';
import AddTestDrawer from '../components/tests/AddTestDrawer';
import { useSnackbar } from 'notistack';
import { textLengthCheck, inputRangeCheck } from '../utils/helper';
import { TEST_MODULE_PERMISSIONS } from '../constants/permissions';
import usePermission from '../hooks/usePermission';

const EditAssessmentsDrawer = lazy(
  () => import('../components/tests/EditAssessmentsDrawer'),
);

const {
  Wrapper,
  Header,
  Left,
  Img,
  AnimatedBox,
  StyledDiv,
  StyledSpan,
  StyledImg,
} = detailsPageStyle();

const TestDetails = () => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();
  const testId = location.pathname.substring(7, location.pathname.length) || '';
  const { hasPermission } = usePermission();
  const isMounted = useRef(false);

  const [actionIndex, setActionIndex] = useState(0);
  const [actionOpen, setActionOpen] = useState(false);
  const [openTestDrawer, setOpenTestDrawer] = useState(false);
  const [openAssessmentDrawer, setOpenAssessmentDrawer] = useState(false);
  const [testObj, setTestObj] = useState({
    ...TEST_MODULE?.TEST_OBJ_STRUCTURE,
  });
  const [testObjError, setTestObjError] = useState({
    ...TEST_MODULE?.TEST_OBJ_ERROR_STRUCTURE,
  });
  const [assessmentObj, setAssessmentObj] = useState({});
  const [showCsvUploadBtn, setShowCsvUploadBtn] = useState(true);
  const [categoryCheckboxes, setCategoryCheckboxes] = useState([]);
  const [skillsCheckboxes, setSkillsCheckboxes] = useState([]);
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const selectedLanguage = sessionStorage?.getItem('selectedLanguage') || 'en';

  const {
    data: testDetailsData,
    status: getTestDetailsStatus,
    isFetching: isFetchingTestDetails,
    isLoading: isLoadingTestDetails,
    refetch: refetchTestDetails,
  } = useGetTestDetails(testId, selectedLanguage);

  const { data: testCategoriesData } = useGetTestCategories();

  const {
    mutate: uploadTestCsv,
    status: uploadTestCsvStatus,
    error: uploadCSVError,
  } = usePostUploadTestCsv(testId, selectedLanguage);

  const { mutate: editTestMutate, status: putEditTestStatus } = usePutEditTest(
    testId,
    selectedLanguage,
  );

  const { mutate: updateAssessmentMutate, status: updateAssessmentStatus } =
    usePutUpdateTestAssessment(selectedLanguage);

  useEffect(() => {
    if (!isFetchingTestDetails) {
      setTestObj({
        testName: testDetailsData?.testName,
        testDescription: testDetailsData?.testDescription,
        testPricing: {
          displayPrice: testDetailsData?.testPricing?.displayPrice,
          actualPrice: testDetailsData?.testPricing?.actualPrice,
        },
        salaryBenefits: testDetailsData?.salaryBenefits,
        salaryRange: testDetailsData?.salaryRange,
        testIntroVideo: testDetailsData?.testIntroVideo,
        imageUrl: testDetailsData?.imageUrl,
        certificateBenefits: { ...testDetailsData?.certificateBenefits },
        medalBenefits: { ...testDetailsData?.medalBenefits },
      });
      setShowCsvUploadBtn(testDetailsData?.testAssessments?.length === 0);
    }
  }, [isFetchingTestDetails]);

  useEffect(() => {
    if (testCategoriesData && testDetailsData) {
      const updatedCheckboxes = [];
      const updatedSkillsCheckboxes = [];
      testCategoriesData?.testCategories?.map((item) =>
        updatedCheckboxes.push({
          key: item?.employmentType,
          value: item?.employmentName,
          checked: false,
        }),
      );
      updatedCheckboxes?.map((item) => {
        if (testDetailsData?.testCategory?.includes(item?.key)) {
          item.checked = true;
        }
      });

      testCategoriesData?.testSkills?.map((item) =>
        updatedSkillsCheckboxes.push({
          key: item,
          value: item,
          checked: false,
        }),
      );
      updatedSkillsCheckboxes?.map((item) => {
        if (testDetailsData?.testSkills?.includes(item?.key)) {
          item.checked = true;
        }
      });
      setCategoryCheckboxes(updatedCheckboxes);
      setSkillsCheckboxes(updatedSkillsCheckboxes);
    }
  }, [testCategoriesData, testDetailsData]);

  useEffect(() => {
    if (putEditTestStatus === 'success') {
      setOpenTestDrawer(false);
      refetchTestDetails();
      enqueueSnackbar('Test updated successfully!', {
        variant: 'success',
      });
    } else if (putEditTestStatus === 'error') {
      enqueueSnackbar(`Failed to updated test.`, {
        variant: 'error',
      });
    }
  }, [putEditTestStatus]);

  useEffect(() => {
    if (updateAssessmentStatus === 'success') {
      setOpenAssessmentDrawer(false);
      refetchTestDetails();
      enqueueSnackbar('Assessment updated successfully!', {
        variant: 'success',
      });
    } else if (updateAssessmentStatus === 'error') {
      enqueueSnackbar(`Failed to updated assessment.`, {
        variant: 'error',
      });
    }
  }, [updateAssessmentStatus]);

  useEffect(() => {
    if (uploadTestCsvStatus === 'success') {
      refetchTestDetails();
      enqueueSnackbar('CSV uploaded successfully!', {
        variant: 'success',
      });
    } else if (uploadTestCsvStatus === 'error') {
      enqueueSnackbar(
        `Failed to upload CSV file. error : ${uploadCSVError?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [uploadTestCsvStatus]);

  const handleCsvUpload = (file) => {
    const formData = new FormData();
    formData.append('files', file);
    uploadTestCsv(formData);
  };

  const handleActionClick = (e, idx) => {
    e.stopPropagation();
    setActionOpen(!actionOpen);
    setActionIndex(idx);
  };

  const handleEditAssessment = () => {
    setActionOpen(false);
    setOpenAssessmentDrawer(true);
    setAssessmentObj(testDetailsData?.testAssessments?.[actionIndex]);
  };

  const handleEditTest = () => {
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
      const skillsArr = skillsCheckboxes?.filter((item) => {
        return item.checked;
      });
      editTestMutate({
        ...testObj,
        testCategory: categoryArr?.map((item) => item.key),
        testSkills: skillsArr?.map((item) => item.key),
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
        key: item?.employmentType,
        value: item?.employmentName,
        checked: false,
      }),
    );
    updatedCheckboxes?.map((item) => {
      if (testDetailsData?.testCategory?.includes(item?.key)) {
        item.checked = true;
      }
    });
    testCategoriesData?.testSkills?.map((item) =>
      updatedSkillsCheckboxes.push({
        key: item,
        value: item,
        checked: false,
      }),
    );
    updatedSkillsCheckboxes?.map((item) => {
      if (testDetailsData?.testCategory?.includes(item?.key)) {
        item.checked = true;
      }
    });
    setCategoryCheckboxes(updatedCheckboxes);
    setSkillsCheckboxes(updatedSkillsCheckboxes);
    setTestObj({
      testName: testDetailsData?.testName,
      testDescription: testDetailsData?.testDescription,
      testPricing: {
        displayPrice: testDetailsData?.testPricing?.displayPrice,
        actualPrice: testDetailsData?.testPricing?.actualPrice,
      },
      salaryBenefits: testDetailsData?.salaryBenefits,
      salaryRange: testDetailsData?.salaryRange,
      testIntroVideo: testDetailsData?.testIntroVideo,
      imageUrl: testDetailsData?.imageUrl,
      certificateBenefits: { ...testDetailsData?.certificateBenefits },
      medalBenefits: { ...testDetailsData?.medalBenefits },
    });
    setTestObjError({ ...TEST_MODULE?.TEST_OBJ_ERROR_STRUCTURE });
  };

  const handleUpdateAssessment = (obj) => {
    setAssessmentObj(obj);
    const payload = {
      testId: testId,
      assessmentId: obj?._id,
      assessmentData: { ...obj },
    };
    updateAssessmentMutate(payload);
  };

  const arrBtnHeader = [
    {
      text: 'Edit',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: () => setOpenTestDrawer(true),
      permission: TEST_MODULE_PERMISSIONS?.EDIT_TEST_DETAILS,
    },
    {
      text: 'Upload CSV',
      icon: ICONS.CSV_GRAY,
      active: true,
      isVisible: showCsvUploadBtn,
      color: '#000',
      type: 'input',
      handleFileUpload: (file) => handleCsvUpload(file),
      onClick: () => {},
      permission: TEST_MODULE_PERMISSIONS?.ADD_TEST,
    },
  ];

  const arrBtnAssessment = [
    {
      text: 'Edit',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleEditAssessment,
      permission: TEST_MODULE_PERMISSIONS?.EDIT_TEST_DETAILS,
    },
  ];

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (arrBtnHeader.length > 0) {
      const hasAnyPermission = arrBtnHeader.some((btn) =>
        hasPermission(btn.permission),
      );
      setShowActionsPanel(hasAnyPermission);
    }
  }, [arrBtnHeader, hasPermission]);

  const Loader = () => {
    return (
      <AnimatedBox>
        {[1, 2, 3, 4, 5].map((item, idx) => {
          return <Skeleton animation="wave" height={70} key={idx} />;
        })}
      </AnimatedBox>
    );
  };

  const renderTestAssessments = () => {
    return testDetailsData?.testAssessments?.map((test, idx) => {
      return (
        <StyledDiv
          key={test?._id}
          $width={'calc(100% - 40px)'}
          $padding={'14px 20px'}
          $background={'rgb(244, 246, 250)'}
          $borderRadius={'10px'}
          $border={'1px solid rgb(205, 212, 223)'}
          $flexDirection={'row'}
          // $justifyContent={'space-between'}
        >
          <StyledDiv
            $flexDirection={'row'}
            $justifyContent={'flex-start'}
            $gap={'20px'}
          >
            <StyledSpan $color={'#000'} $fontSize={'18px'} $fontWeight={500}>
              {idx + 1}.
            </StyledSpan>
            <StyledSpan $color={'#000'} $fontSize={'18px'} $fontWeight={500}>
              {test?.assessmentName}
            </StyledSpan>
          </StyledDiv>
          <StyledDiv $width={'auto'}>
            {hasPermission(TEST_MODULE_PERMISSIONS?.EDIT_TEST_DETAILS) ? (
              <StyledImg
                src={ICONS?.THREE_DOTS}
                alt="more"
                onClick={(e) => handleActionClick(e, idx)}
              />
            ) : null}
            {actionIndex === idx && actionOpen ? (
              <ActionButton
                arrBtn={arrBtnAssessment}
                setActionOpen={setActionOpen}
                setActionIndex={setActionIndex}
                top={'0px'}
              />
            ) : null}
          </StyledDiv>
        </StyledDiv>
      );
    });
  };

  return (
    <Wrapper>
      <Header>
        <Left>
          <Img
            src={ICONS.LEFT_ARROW_BLACK}
            alt="back"
            width="20px"
            height="20px"
            onClick={() => navigate(-1)}
          />
        </Left>
      </Header>
      <Suspense fallback={<Loader />}>
        <PageHeader
          heading={testDetailsData?.testName}
          arrBtn={arrBtnHeader}
          showActionsPanel={showActionsPanel}
        />
        <Description desc={testDetailsData?.testDescription} />
        <CourseDetailsHeader testDetailsData={testDetailsData} />
        {testDetailsData?.testAssessments?.length > 0 ? (
          <StyledDiv
            $background={'#fff'}
            $width={`calc(100% - 40px)`}
            $borderRadius={'16px'}
            $margin={'16px 0'}
            $padding={'20px'}
            $gap={'20px'}
            $border={'1px solid rgb(205, 212, 223)'}
            $justifyContent={'flex-start'}
          >
            {renderTestAssessments()}
          </StyledDiv>
        ) : null}
        <AddTestDrawer
          open={openTestDrawer}
          toggleDrawer={setOpenTestDrawer}
          testObj={testObj}
          setTestObj={setTestObj}
          testObjError={testObjError}
          setTestObjError={setTestObjError}
          handleAddTest={handleEditTest}
          testDetailsData={testDetailsData}
          testStatus={putEditTestStatus}
          isEdit={true}
          categoryCheckboxes={categoryCheckboxes}
          setCategoryCheckboxes={setCategoryCheckboxes}
          skillsCheckboxes={skillsCheckboxes}
          setSkillsCheckboxes={setSkillsCheckboxes}
          clearFields={clearFields}
        />
        <EditAssessmentsDrawer
          open={openAssessmentDrawer}
          toggleDrawer={setOpenAssessmentDrawer}
          assessmentObj={assessmentObj}
          handleUpdateAssessment={handleUpdateAssessment}
          updateAssessmentStatus={updateAssessmentStatus}
        />
      </Suspense>
    </Wrapper>
  );
};

export default TestDetails;
