import React, { Suspense, useEffect, useState, lazy, useRef } from 'react';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useGetCourseDetails,
  usePostUploadCsv,
  usePutCourse,
  usePutCourseModule,
  usePutCourseSubModule,
  useDeleteCourseAssessment,
  useGetGlobalData,
} from '../apis/queryHooks';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { COURSE_MODULE } from '../constants';
import { COURSE_MODULE_PERMISSIONS } from '../constants/permissions';
import {
  textLengthCheck,
  inputRangeCheck,
  isValidHttpUrl,
} from '../utils/helper';
import PropTypes from 'prop-types';
import detailsPageStyle from '../style/detailsPageStyle';
import usePermission from '../hooks/usePermission';

const PageHeader = lazy(() => import('../components/courseDetail/PageHeader'));
const RatingReview = lazy(
  () => import('../components/courseDetail/RatingReview'),
);
const Description = lazy(
  () => import('../components/courseDetail/Description'),
);
const CourseDetailsHeader = lazy(
  () => import('../components/courseDetail/CourseDetailsHeader'),
);
const ModuleContainer = lazy(
  () => import('../components/courseDetail/ModuleContainer'),
);
const EditModuleDrawer = lazy(
  () => import('../components/courseDetail/EditModuleDrawer'),
);
const EditSubModuleDrawer = lazy(
  () => import('../components/courseDetail/EditSubModuleDrawer'),
);
const AddCourseDrawer = lazy(
  () => import('../components/courses/AddCourseDrawer'),
);
const AddAssessmentDrawer = lazy(
  () => import('../components/courses/AddAssessmentDrawer'),
);
const ViewAssessmentDrawer = lazy(
  () => import('../components/courses/ViewAssessmentDrawer'),
);
const PsychometricAssessmentDrawer = lazy(
  () => import('../components/courseDetail/PsychAssessmentDrawer'),
);

const { Wrapper, Header, Left, Img, AnimatedBox } = detailsPageStyle();

const CourseDetails = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.substring(9, location.pathname.length);
  const isMounted = useRef(false);
  const { hasPermission } = usePermission();
  const [showLoader, setShowLoader] = useState(false);
  const [courseModuleId, setCourseModuleId] = useState('');
  const [courseSubModuleId, setCourseSubModuleId] = useState('');
  const [openCourseDrawer, setOpenCourseDrawer] = useState(false);
  const [openPsychAssessmentDrawer, setOpenPsychAssessmentDrawer] =
    useState(false);
  const [openModuleDrawer, setOpenModuleDrawer] = useState(false);
  const [openSubModuleDrawer, setOpenSubModuleDrawer] = useState(false);
  const [moduleObj, setModuleObj] = useState({
    moduleTitle: '',
    description: '',
    videoStatus: '',
    hasCertificate: false,
    certificateType: COURSE_MODULE?.DEFAULT_CERTIFICATE_TYPE,
  });
  const [subModuleObj, setSubModuleObj] = useState({
    subModuleTitle: '',
    description: '',
    videoUrl: '',
    imageUrl: '',
    duration: '',
    videoStatus: '',
  });

  const [subModuleData, setSubModuleData] = useState({});

  const [assessmentObj, setAssessmentObj] = useState({});
  const [courseObj, setCourseObj] = useState({});
  const [openAssessmentDrawer, setOpenAssessmentDrawer] = useState(false);
  const [openViewAssessmentDrawer, setOpenViewAssessmentDrawer] =
    useState(false);
  const [isEditAssessment, setIsEditAssessment] = useState(false);
  const [isViewSubmodule, setIsViewSubmodule] = useState(false);
  const [courseObjEdit, setCourseObjEdit] = useState({});
  const [courseObjError, setCourseObjError] = useState({
    ...COURSE_MODULE?.COURSE_OBJ_ERROR_STRUCTURE,
  });
  const [showCsvUploadBtn, setShowCsvUploadBtn] = useState(true);
  const [showActionsPanel, setShowActionsPanel] = useState(true);

  const { data: globalData } = useGetGlobalData();
  const selectedLanguage = sessionStorage?.getItem('selectedLanguage') || 'en';

  const {
    mutate: uploadCsv,
    status: uploadCsvStatus,
    isError: isUploadScvError,
    error: uploadCSVError,
  } = usePostUploadCsv(courseId, selectedLanguage);

  const {
    data: courseData,
    status: courseDataStatus,
    isLoading: isCourseDataLoading,
    isFetching: isCourseDataFetching,
    refetch: refetchCourseDetails,
    isError: isGetCourseDetailErr,
    error: getCourseDetailErr,
  } = useGetCourseDetails(
    courseId,
    sessionStorage?.getItem('selectedLanguage'),
  );

  useEffect(() => {
    if (
      (courseDataStatus === 'success' && courseData?.modules?.length > 0) ||
      courseDataStatus === 'error'
    ) {
      setShowLoader(false);
    }

    if (!isCourseDataFetching || !isCourseDataLoading) {
      setCourseObj({ ...courseData });
      setCourseObjEdit({
        courseTitle: courseData?.courseTitle,
        courseTitleI18n: courseData?.courseTitleI18n,
        courseDescriptionI18n: courseData?.courseDescriptionI18n,
        courseIntroVideoI18n: courseData?.courseIntroVideoI18n,
        videoStatusI18n: courseData?.videoStatusI18n,
        salaryBenefitI18n: courseData?.salaryBenefitI18n,
        imageUrlI18n: courseData?.imageUrlI18n,
        imageS3UrlI18n: courseData?.imageS3UrlI18n,
        verticalImageUrlI18n: courseData?.verticalImageUrlI18n,
        trainingCertificateI18n: courseData?.trainingCertificateI18n,
        trainingRewardI18n: courseData?.trainingRewardI18n,
        courseCategory: courseData?.courseCategory,
        price: {
          coursePrice: courseData?.coursePrice?.coursePrice,
          displayPrice: courseData?.coursePrice?.displayPrice,
        },
        courseDescription: courseData?.courseDescription,
        salaryBenefit: courseData?.salaryBenefit,
        certificateBenefits: {
          salaryBenefit: courseData?.certificateBenefits?.salaryBenefit,
          salaryBenefitI18n: courseData?.certificateBenefits?.salaryBenefitI18n,
          trainingCertificate:
            courseData?.certificateBenefits?.trainingCertificate,
          trainingCertificateI18n:
            courseData?.certificateBenefits?.trainingCertificateI18n,
          trainingReward: courseData?.certificateBenefits?.trainingReward,
          trainingRewardI18n:
            courseData?.certificateBenefits?.trainingRewardI18n,
        },
        trophyBenefits: {
          salaryBenefit: courseData?.trophyBenefits?.salaryBenefit,
          salaryBenefitI18n: courseData?.trophyBenefits?.salaryBenefitI18n,
          trainingCertificate: courseData?.trophyBenefits?.trainingCertificate,
          trainingCertificateI18n:
            courseData?.trophyBenefits?.trainingCertificateI18n,
          trainingReward: courseData?.trophyBenefits?.trainingReward,
          trainingRewardI18n: courseData?.trophyBenefits?.trainingRewardI18n,
        },
        badgeBenefits: {
          salaryBenefit: courseData?.badgeBenefits?.salaryBenefit,
          salaryBenefitI18n: courseData?.badgeBenefits?.salaryBenefitI18n,
          trainingCertificate: courseData?.badgeBenefits?.trainingCertificate,
          trainingCertificateI18n:
            courseData?.badgeBenefits?.trainingCertificateI18n,
          trainingReward: courseData?.badgeBenefits?.trainingReward,
          trainingRewardI18n: courseData?.badgeBenefits?.trainingRewardI18n,
        },
        trainingBenefits: {
          salaryBenefit: courseData?.trainingBenefits?.salaryBenefit,
          salaryBenefitI18n: courseData?.trainingBenefits?.salaryBenefitI18n,
          trainingCertificate:
            courseData?.trainingBenefits?.trainingCertificate,
          trainingCertificateI18n:
            courseData?.trainingBenefits?.trainingCertificateI18n,
          trainingReward: courseData?.trainingBenefits?.trainingReward,
          trainingRewardI18n: courseData?.trainingBenefits?.trainingRewardI18n,
        },
      });
    }

    setShowCsvUploadBtn(courseData?.modules?.length > 0 ? false : true);
  }, [isCourseDataLoading, isCourseDataFetching, courseDataStatus, courseData]);

  useEffect(() => {
    if (uploadCsvStatus === 'pending') setShowLoader(true);
    else if (uploadCsvStatus === 'success') {
      setOpenCourseDrawer(false);
      refetchCourseDetails();
      enqueueSnackbar('CSV file uploaded successfully!', {
        variant: 'success',
      });
    } else if (uploadCsvStatus === 'error') {
      setShowLoader(false);
      enqueueSnackbar(
        `Failed to upload CSV file. error : ${uploadCSVError?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [uploadCsvStatus]);

  const {
    mutate: editCourseMutation,
    status: putCourseStatus,
    isError: isPutCourseErr,
    error: putCourseErr,
  } = usePutCourse(courseId, selectedLanguage);

  const {
    mutate: editCourseModuleMutation,
    status: putModuleStatus,
    isError: isPutCourseModErr,
    error: putCourseModErr,
  } = usePutCourseModule(courseModuleId, {}, selectedLanguage);

  const {
    mutate: editCourseSubModuleMutation,
    status: putSubModuleStatus,
    isError: isPutCourseSubModErr,
    error: putCourseSubModErr,
  } = usePutCourseSubModule(courseSubModuleId, {}, selectedLanguage);

  const {
    mutate: deleteCourseAssessmentMutation,
    status: deleteCourseAssessmentStatus,
    isError: isDeleteAssessErr,
    error: deleteAssessErr,
  } = useDeleteCourseAssessment(assessmentObj?._id);

  useEffect(() => {
    if (deleteCourseAssessmentStatus === 'success') {
      refetchCourseDetails();
      enqueueSnackbar('Course assessment deleted successfully !', {
        variant: 'success',
      });
    } else if (deleteCourseAssessmentStatus === 'error') {
      enqueueSnackbar(
        `Error in course assessment delete. ${deleteAssessErr?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [deleteCourseAssessmentStatus]);

  const toggleSubModuleDrawer = (newOpen) => {
    setOpenSubModuleDrawer(newOpen);
  };

  const toggleViewAssessmentDrawer = (newOpen) => {
    setOpenViewAssessmentDrawer(newOpen);
  };

  const handleLeftArrow = () => {
    navigate(-1);
  };

  const handleEditCourse = () => {
    const errorFields = {
      courseTitle: textLengthCheck(
        courseObjEdit?.courseTitle,
        COURSE_MODULE?.TITLE_MAX_LENGTH,
      ),
      courseDescription: textLengthCheck(
        courseObjEdit?.courseDescription,
        COURSE_MODULE?.DESCRIPTION_MAX_LENGTH,
      ),
      courseCategory: textLengthCheck(courseObjEdit?.courseCategory),
      coursePrice: inputRangeCheck(
        courseObjEdit?.price?.coursePrice,
        COURSE_MODULE?.COURSE_PRICE_MAX,
      ),
      displayPrice: inputRangeCheck(
        courseObjEdit?.price?.displayPrice,
        COURSE_MODULE?.DISPLAY_PRICE_MAX,
      ),
      salaryBenefit: textLengthCheck(
        courseObjEdit?.salaryBenefit,
        COURSE_MODULE?.DESCRIPTION_MAX_LENGTH,
      ),
    };
    if (
      JSON.stringify(errorFields) ===
      JSON.stringify(COURSE_MODULE?.COURSE_OBJ_ERROR_STRUCTURE)
    ) {
      editCourseMutation(courseObjEdit);
    } else {
      setCourseObjError({
        ...courseObjError,
        ...errorFields,
      });
    }
  };

  const handleCourseEditModule = () => {
    editCourseModuleMutation(moduleObj);
  };

  const handleCourseEditSubModule = () => {
    editCourseSubModuleMutation(subModuleObj);
  };

  const handlePostAssessmenttSuccess = () => {
    refetchCourseDetails();
    setOpenAssessmentDrawer(false);
  };

  useEffect(() => {
    if (putCourseStatus === 'success') {
      refetchCourseDetails();
      setOpenCourseDrawer(false);

      enqueueSnackbar('Course updated successfully!', {
        variant: 'success',
      });
    } else if (putCourseStatus === 'error') {
      enqueueSnackbar(
        `Failed to updated course. error : ${putCourseErr?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [putCourseStatus]);

  useEffect(() => {
    if (putModuleStatus === 'success') {
      refetchCourseDetails();
      setOpenModuleDrawer(false);
      setModuleObj({});

      enqueueSnackbar('Course module updated successfully!', {
        variant: 'success',
      });
    } else if (putModuleStatus === 'error') {
      enqueueSnackbar(
        `Failed to updated course module. error : ${putCourseModErr?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [putModuleStatus]);

  useEffect(() => {
    if (putSubModuleStatus === 'success') {
      refetchCourseDetails();
      setOpenSubModuleDrawer(false);
      setSubModuleObj({});

      enqueueSnackbar('Course sub module updated successfully!', {
        variant: 'success',
      });
    } else if (putSubModuleStatus === 'error') {
      enqueueSnackbar(
        `Failed to updated course sub module. error : ${putCourseSubModErr?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [putSubModuleStatus]);

  const clearCourseFields = () => {
    setCourseObjEdit({
      courseTitle: courseData?.courseTitle,
      courseCategory: courseData?.courseCategory,
      price: {
        coursePrice: courseData?.coursePrice?.coursePrice,
        displayPrice: courseData?.coursePrice?.displayPrice,
      },
      courseDescription: courseData?.courseDescription,
      salaryBenefit: courseData?.salaryBenefit,
      certificateBenefits: {
        salaryBenefit: courseData?.certificateBenefits?.salaryBenefit,
        trainingCertificate:
          courseData?.certificateBenefits?.trainingCertificate,
        trainingReward: courseData?.certificateBenefits?.trainingReward,
      },
      trophyBenefits: {
        salaryBenefit: courseData?.trophyBenefits?.salaryBenefit,
        trainingCertificate: courseData?.trophyBenefits?.trainingCertificate,
        trainingReward: courseData?.trophyBenefits?.trainingReward,
      },
      badgeBenefits: {
        salaryBenefit: courseData?.badgeBenefits?.salaryBenefit,
        trainingCertificate: courseData?.badgeBenefits?.trainingCertificate,
        trainingReward: courseData?.badgeBenefits?.trainingReward,
      },
      trainingBenefits: {
        salaryBenefit: courseData?.trainingBenefits?.salaryBenefit,
        trainingCertificate: courseData?.trainingBenefits?.trainingCertificate,
        trainingReward: courseData?.trainingBenefits?.trainingReward,
      },
    });
    setCourseObjError({ ...COURSE_MODULE?.COURSE_OBJ_ERROR_STRUCTURE });
  };

  const handleCsvUpload = (file) => {
    const formData = new FormData();
    formData.append('files', file);
    uploadCsv(formData);
  };

  const arrBtn = [
    {
      text: 'Edit',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: () => setOpenCourseDrawer(true),
      permission: COURSE_MODULE_PERMISSIONS.EDIT_COURSE_DETAILS,
    },
    {
      text: 'Psych Traits',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: () => setOpenPsychAssessmentDrawer(true),
      permission: COURSE_MODULE_PERMISSIONS.EDIT_COURSE_DETAILS,
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
      permission: COURSE_MODULE_PERMISSIONS.ADD_COURSE,
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

  const Loader = () => {
    return (
      <AnimatedBox>
        {[1, 2, 3, 4, 5].map((item, idx) => {
          return <Skeleton animation="wave" height={70} key={idx} />;
        })}
      </AnimatedBox>
    );
  };

  return (
    <Wrapper>
      <Header>
        <Left onClick={() => handleLeftArrow()}>
          <Img
            src={ICONS.LEFT_ARROW_BLACK}
            alt="leftArrowBlack"
            width={'24px'}
            height={'24px'}
          />
        </Left>
      </Header>
      <Suspense fallback={<Loader />}>
        <PageHeader
          heading={courseData?.courseTitle}
          subHeading={courseData?.courseCategory}
          arrBtn={arrBtn}
          showActionsPanel={showActionsPanel}
        />
        <RatingReview courseData={courseData} />
        <Description
          desc={courseData?.courseDescription}
          courseIntroVideo={courseData?.courseIntroVideo}
        />
        <CourseDetailsHeader courseData={courseData} />

        {!showLoader ? (
          <ModuleContainer
            onClickFn={() => setOpenModuleDrawer(true)}
            onClickFnSub={toggleSubModuleDrawer}
            courseData={courseData}
            setOpenSubModuleDrawer={setOpenSubModuleDrawer}
            setOpenAssessmentDrawer={setOpenAssessmentDrawer}
            setCourseSubModuleId={setCourseSubModuleId}
            setCourseModuleId={setCourseModuleId}
            setModuleObj={setModuleObj}
            setSubModuleObj={setSubModuleObj}
            setSubModuleData={setSubModuleData}
            setAssessmentObj={setAssessmentObj}
            setOpenViewAssessmentDrawer={setOpenViewAssessmentDrawer}
            setIsEditAssessment={setIsEditAssessment}
            setIsViewSubmodule={setIsViewSubmodule}
            deleteCourseAssessmentMutation={deleteCourseAssessmentMutation}
            handleCsvUpload={handleCsvUpload}
          />
        ) : (
          <Loader />
        )}
      </Suspense>
      <Suspense fallback={<div></div>}>
        <AddCourseDrawer
          open={openCourseDrawer}
          toggleDrawer={setOpenCourseDrawer}
          handleAddCourse={handleEditCourse}
          editCourseStatus={putCourseStatus}
          courseObj={courseObjEdit}
          setCourseObj={setCourseObjEdit}
          isEdit={true}
          clearFields={clearCourseFields}
          courseObjError={courseObjError}
          setCourseObjError={setCourseObjError}
          courseData={courseData}
          courseCategoryList={globalData?.['EMPLOYMENT_TYPES']}
        />
        <PsychometricAssessmentDrawer
          open={openPsychAssessmentDrawer}
          toggleDrawer={setOpenPsychAssessmentDrawer}
          courseData={courseData}
        />
        <EditModuleDrawer
          open={openModuleDrawer}
          toggleDrawer={setOpenModuleDrawer}
          moduleObj={moduleObj}
          setModuleObj={setModuleObj}
          handleCourseEditModule={handleCourseEditModule}
          editCourseModuleStatus={putModuleStatus}
          courseData={courseData}
        />
        <EditSubModuleDrawer
          open={openSubModuleDrawer}
          toggleDrawer={toggleSubModuleDrawer}
          courseId={courseId}
          courseModuleId={courseModuleId}
          courseSubModuleId={courseSubModuleId}
          subModuleObj={subModuleObj}
          setSubModuleObj={setSubModuleObj}
          handleCourseEditSubModule={handleCourseEditSubModule}
          editSubmoduleStatus={putSubModuleStatus}
          isViewSubmodule={isViewSubmodule}
          courseData={courseData}
          subModuleData={subModuleData}
        />
        <AddAssessmentDrawer
          open={openAssessmentDrawer}
          toggleDrawer={setOpenAssessmentDrawer}
          courseId={courseId}
          courseSubModuleId={courseSubModuleId}
          handlePostAssessmenttSuccess={handlePostAssessmenttSuccess}
          isEditAssessment={isEditAssessment}
          setIsEditAssessment={setIsEditAssessment}
          assessmentObj={assessmentObj}
          courseData={courseData}
          globalData={globalData}
        />
        <ViewAssessmentDrawer
          open={openViewAssessmentDrawer}
          toggleDrawer={toggleViewAssessmentDrawer}
          assessmentObj={assessmentObj}
          courseData={courseData}
        />
      </Suspense>
    </Wrapper>
  );
};

export default CourseDetails;
