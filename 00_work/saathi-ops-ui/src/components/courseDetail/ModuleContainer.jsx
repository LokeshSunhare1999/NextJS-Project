import React, { useState, useRef, lazy, Suspense, Fragment } from 'react';
import { styled } from 'styled-components';
import ICONS from '../../assets/icons';
import ActionButton from '../ActionButton';
import { secondsToMinutes } from '../../utils/helper';
const GlobalPop = lazy(() => import('../../components/GlobalPop'));
import PropTypes from 'prop-types';
import usePermission from '../../hooks/usePermission';
import { COURSE_MODULE_PERMISSIONS } from '../../constants/permissions';

const StyledTableContainer = styled.div`
  background-color: #fff;
  border: 1px solid #cdd4df;
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const StyledTableContainerNull = styled(StyledTableContainer)`
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ModuleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 9px 0px;
  border-radius: 10px;
  border: 1px solid #cdd4df;
  background: #f4f6fa;
  // cursor: pointer;
`;

const ModuleDiv = styled.div`
  display: flex;
  width: calc(100% - 40px);
  padding: 5px 20px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props?.$gap};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props?.$gap};
  position: relative;
`;

const P = styled.p`
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => props?.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  //   position: relative;
  cursor: ${(props) => (props?.$isCursor ? 'pointer' : '')};
  margin: ${(props) => props.$margin};
`;

const Desc = styled.div`
  display: flex;
  padding: 0px 52px;
  align-items: flex-start;
  gap: 10px;
`;

const SubModule = styled.div`
  display: flex;
  width: calc(100% - 40px);
  padding: 0px 32px 0px 19px;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
`;

const Hr = styled.div`
  width: 100%;
  height: 1px;
  background: #cdd4df;
  margin: 10px 0px;
`;

const ModuleOpen = styled.div`
  width: 100%;
`;

const StyledInput = styled.input`
  display: none;
`;

const ModuleContainer = ({
  onClickFn,
  onClickFnSub,
  courseData,
  setOpenSubModuleDrawer,
  setOpenAssessmentDrawer,
  setCourseSubModuleId,
  setCourseModuleId,
  setModuleObj,
  setSubModuleObj,
  setSubModuleData,
  setAssessmentObj,
  setOpenViewAssessmentDrawer,
  setIsEditAssessment,
  setIsViewSubmodule,
  deleteCourseAssessmentMutation,
  handleCsvUpload,
}) => {
  const { hasPermission } = usePermission();
  const [moduleOpen, setModuleOpen] = useState(false);
  const [moduleIndex, setModuleIndex] = useState('');
  const [subModuleIndex, setSubModuleIndex] = useState('');
  const [subModuleAssessIndex, setSubModuleAssessIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [actionAssessOpen, setActionAssessOpen] = useState(false);
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [actionBtnPosition, setActionBtnPosition] = useState('bottom');
  const hiddenFileInput = useRef(null);

  const checkActionBtnPosition = (mouseY) => {
    const viewportHeight = document.documentElement.scrollHeight;

    if (viewportHeight - mouseY < 170) {
      setActionBtnPosition('top');
    } else {
      setActionBtnPosition('bottom');
    }
  };

  const handleInputBtnClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleInputChange = (event) => {
    const fileUploaded = event.target.files[0];
    handleCsvUpload(fileUploaded);
  };

  const handleModuleOpen = (index) => {
    setModuleOpen(!moduleOpen);
    setActionOpen(false);
    setActionAssessOpen(false);
    setSubModuleIndex('');
    if (moduleIndex === index) {
      setModuleIndex('');
    } else {
      setModuleIndex(index);
    }
  };

  const handleThreeDots = (e, subIndex, subModule) => {
    e.stopPropagation();
    setActionOpen(true);
    setActionAssessOpen(false);
    if (subModuleIndex === subIndex) {
      setSubModuleIndex('');
    } else {
      setSubModuleIndex(subIndex);
      setSubModuleAssessIndex('');
    }

    setCourseSubModuleId(subModule?._id);
    setSubModuleData(subModule);
    setSubModuleObj({
      subModuleTitle: subModule?.subModuleTitle,
      description: subModule?.description,
      imageUrl: subModule?.imageUrl,
      videoUrl: subModule?.videoUrl,
      duration: subModule?.duration,
      videoStatus: subModule?.videoStatus,
      videoId: subModule?.videoId,
      drmStatus: subModule?.drmStatus,
      subModuleTitleI18n: subModule?.subModuleTitleI18n,
      objectivesI18n: subModule?.objectivesI18n,
      descriptionI18n: subModule?.descriptionI18n,
      imageUrlI18n: subModule?.imageUrlI18n,
      videoUrlI18n: subModule?.videoUrlI18n,
      videoIdI18n: subModule?.videoIdI18n,
      drmStatusI18n: subModule?.drmStatusI18n,
      videoStatusI18n: subModule?.videoStatusI18n,
    });
    checkActionBtnPosition(e.pageY);
  };

  const handleThreeDotsAssessment = (e, subIndex, assessment) => {
    e.stopPropagation();
    setActionOpen(false);
    setActionAssessOpen(true);

    if (subModuleAssessIndex === subIndex) {
      setSubModuleAssessIndex('');
    } else {
      setSubModuleAssessIndex(subIndex);
      setSubModuleIndex('');
    }

    setAssessmentObj({ ...assessment });
    checkActionBtnPosition(e.pageY);
  };

  const handleModuleClick = (e, module) => {
    onClickFn();
    e.stopPropagation();
    setCourseModuleId(module?._id);
    setModuleObj({
      moduleTitle: module?.moduleTitle,
      description: module?.description,
      imageUrl: module?.imageUrl,
      videoUrl: module?.videoUrl,
      videoStatus: module?.videoStatus,
      moduleTitleI18n: module?.moduleTitleI18n,
      descriptionI18n: module?.descriptionI18n,
      imageUrlI18n: module?.imageUrlI18n,
      videoUrlI18n: module?.videoUrlI18n,
      videoStatusI18n: module?.videoStatusI18n,
      hasCertificate: module?.hasCertificate,
      certificateType: module?.certificateType,
    });
  };

  const handleSubModule = (e, type, subIndex, entity) => {
    e.stopPropagation();
    setActionAssessOpen(false);
    setActionOpen(false);
    handleOpenEntity(type, entity);
  };

  const handleOpenEntity = (type, entity) => {
    switch (type) {
      case 'assessment':
        setAssessmentObj({ ...entity });
        handleViewAssessment();
        break;
      case 'submodule':
        setSubModuleObj({
          subModuleTitle: entity?.subModuleTitle,
          description: entity?.description,
          imageUrl: entity?.imageUrl,
          videoUrl: entity?.videoUrl,
          duration: entity?.duration,
          videoStatus: entity?.videoStatus,
        });
        handleSubModuleView();
        break;
    }
  };

  const handleSubModuleEdit = (e) => {
    e.stopPropagation();
    setActionOpen(false);
    setIsViewSubmodule(false);
    setOpenSubModuleDrawer(true);
    setSubModuleIndex('');
  };

  const handleSubModuleView = () => {
    setActionOpen(false);
    setIsViewSubmodule(true);
    setOpenSubModuleDrawer(true);
    setSubModuleIndex('');
  };

  const handleAddAssessment = (e) => {
    e.stopPropagation();
    setActionOpen(false);
    setOpenAssessmentDrawer(true);
  };

  const handleViewAssessment = () => {
    setActionAssessOpen(false);
    setOpenViewAssessmentDrawer(true);
    setSubModuleAssessIndex('');
  };

  const handleEditAssessment = (e) => {
    e.stopPropagation();
    setActionAssessOpen(false);
    setIsEditAssessment(true);
    setOpenAssessmentDrawer(true);
    setSubModuleAssessIndex('');
  };

  const handleDelete = () => {
    setOpenDeletePop(false);
    setActionAssessOpen(false);
    deleteCourseAssessmentMutation();
  };

  const handleDeleteAssessment = (e) => {
    e.stopPropagation();
    setOpenDeletePop(true);
  };

  const arrBtnSubModule = (show) => [
    {
      text: 'View',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleSubModuleView,
      permission: COURSE_MODULE_PERMISSIONS.VIEW_COURSE_DETAILS,
    },
    {
      text: 'Edit',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleSubModuleEdit,
      permission: COURSE_MODULE_PERMISSIONS.EDIT_COURSE_DETAILS,
    },
    {
      text: 'Add Assessment',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: show,
      color: '#000',
      onClick: handleAddAssessment,
      permission: COURSE_MODULE_PERMISSIONS.EDIT_COURSE_DETAILS,
    },
  ];

  const arrBtnAssessment = [
    {
      text: 'View',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleViewAssessment,
      permission: COURSE_MODULE_PERMISSIONS.VIEW_COURSE,
    },
    {
      text: 'Edit',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleEditAssessment,
      permission: COURSE_MODULE_PERMISSIONS.EDIT_COURSE,
    },
    {
      text: 'Delete',
      icon: ICONS.DELETE_ICON,
      active: true,
      isVisible: true,
      color: '#DD4141',
      onClick: handleDeleteAssessment,
      permission: COURSE_MODULE_PERMISSIONS.DELETE_COURSE,
    },
  ];

  const renderNoDataContainer = (
    permission = COURSE_MODULE_PERMISSIONS?.ADD_COURSE,
  ) => {
    if (permission && !hasPermission(permission)) {
      return null;
    }

    return (
      <StyledTableContainerNull onClick={handleInputBtnClick}>
        <P
          $color="#000"
          $fontSize={'16px'}
          $fontWeight={'400'}
          $lineHeight={'normal'}
        >
          Please Upload CSV
        </P>
        <StyledInput
          type="file"
          data-testid="file-input"
          onChange={(e) => handleInputChange(e)}
          ref={hiddenFileInput}
        />
      </StyledTableContainerNull>
    );
  };

  return (
    <>
      {courseData?.modules?.length > 0 ? (
        <StyledTableContainer data-testid="module-wrapper">
          {courseData?.modules?.map((module, index) => {
            return (
              <ModuleWrapper
                onClick={() => handleModuleOpen(index)}
                key={module?._id}
                // data-testid="module-wrapper"
              >
                <ModuleDiv>
                  <Left $gap={'20px'}>
                    <P
                      $color="#000000"
                      $fontSize={'18px'}
                      $fontWeight={'500'}
                      $lineHeight={'normal'}
                    >
                      {`${index + 1}.`}
                    </P>
                    <P
                      $color="#000000"
                      $fontSize={'18px'}
                      $fontWeight={'500'}
                      $lineHeight={'normal'}
                    >
                      {`${module?.moduleTitle}`}
                    </P>
                  </Left>

                  <Right $gap={'20px'}>
                    <Left $gap={'5px'}>
                      <P
                        $color="#677995"
                        $fontSize={'16px'}
                        $fontWeight={'400'}
                        $lineHeight={'normal'}
                      >
                        {module?.subModules?.length}
                      </P>
                      <Img src={ICONS?.OPEN_BOOK_GREEN} />
                    </Left>

                    {module?.noOfAssessments > 0 ? (
                      <Left $gap={'5px'}>
                        <P
                          $color="#677995"
                          $fontSize={'16px'}
                          $fontWeight={'400'}
                          $lineHeight={'normal'}
                        >
                          {module?.noOfAssessments}
                        </P>
                        <Img src={ICONS?.ASSESSMENT_GREEN} />
                      </Left>
                    ) : null}

                    {module?.noOfVideos > 0 ? (
                      <Left $gap={'5px'}>
                        <P
                          $color="#677995"
                          $fontSize={'16px'}
                          $fontWeight={'400'}
                          $lineHeight={'normal'}
                        >
                          {module?.noOfVideos}
                        </P>
                        <Img src={ICONS?.VIDEO_PLACEHOLDER_GREEN} />
                      </Left>
                    ) : null}

                    {module?.noOfThumbnails > 0 ? (
                      <Left $gap={'5px'}>
                        <P
                          $color="#677995"
                          $fontSize={'16px'}
                          $fontWeight={'400'}
                          $lineHeight={'normal'}
                        >
                          {module?.noOfThumbnails}
                        </P>
                        <Img
                          src={ICONS?.IMAGE_PLACEHOLDER_GREEN}
                          width={'16px'}
                          height={'16px'}
                        />
                      </Left>
                    ) : null}

                    {hasPermission(
                      COURSE_MODULE_PERMISSIONS?.EDIT_COURSE_DETAILS,
                    ) ? (
                      <Img
                        src={ICONS.PENCIL}
                        alt="edit"
                        width={'16px'}
                        height={'16px'}
                        $isCursor={true}
                        data-testid="edit"
                        onClick={(event) => handleModuleClick(event, module)}
                      />
                    ) : null}

                    <Img
                      src={
                        moduleOpen && moduleIndex === index
                          ? ICONS.ARROW_UP
                          : ICONS.ARROW_DOWN
                      }
                      alt="arrow_down"
                      width={'24px'}
                      height={'24px'}
                    />
                  </Right>
                </ModuleDiv>
                {moduleIndex === index && (
                  <ModuleOpen>
                    <Desc>
                      <P
                        $color="#535353"
                        $fontSize={'14px'}
                        $fontWeight={'400'}
                        $lineHeight={'normal'}
                      >
                        {module?.description}
                      </P>
                    </Desc>

                    <Hr />
                    {module?.subModules?.map((subModule, subIndex) => {
                      const show =
                        subModule?.assessment === undefined ||
                        subModule?.assessment === null ||
                        subModule?.assessment === '';
                      const arrBtn = arrBtnSubModule(show).filter(
                        (btn) => btn.isVisible,
                      ); //* For action button height calculation
                      return (
                        <Fragment key={subIndex}>
                          <SubModule
                            onClick={(e) =>
                              handleSubModule(
                                e,
                                'submodule',
                                subIndex,
                                subModule,
                              )
                            }
                            key={subModule?._id}
                            data-testid="sub-module"
                          >
                            <Left $gap={'12px'}>
                              <Img src={ICONS.OPEN_BOOK} />
                              <P
                                $color="#000"
                                $fontSize={'16px'}
                                $fontWeight={'400'}
                                $lineHeight={'normal'}
                              >
                                {`${subModule?.subModuleTitle}`}
                              </P>
                            </Left>
                            <Right $gap={'15px'}>
                              <Img
                                src={
                                  subModule?.imageUrl?.length > 0
                                    ? ICONS?.IMAGE_PLACEHOLDER_GREEN
                                    : ICONS?.IMAGE_PLACEHOLDER
                                }
                                width={'16px'}
                                height={'16px'}
                              />
                              <Img
                                src={
                                  subModule?.videoUrl?.length > 0
                                    ? ICONS?.VIDEO_PLACEHOLDER_GREEN
                                    : ICONS?.VIDEO_PLACEHOLDER
                                }
                              />
                              {subModule?.videoUrl?.length > 0 ? (
                                <P
                                  $color="#000"
                                  $fontSize={'16px'}
                                  $fontWeight={'400'}
                                  $lineHeight={'normal'}
                                >
                                  {subModule?.durationString}
                                </P>
                              ) : null}

                              <Img
                                src={ICONS.THREE_DOTS}
                                alt="three_dots"
                                width={'16px'}
                                height={'16px'}
                                $isCursor={true}
                                onClick={(e) =>
                                  handleThreeDots(e, subIndex, subModule)
                                }
                              />

                              {actionOpen && subModuleIndex === subIndex && (
                                <ActionButton
                                  arrBtn={arrBtnSubModule(show)}
                                  setActionOpen={setActionOpen}
                                  isLast={actionBtnPosition !== 'bottom'}
                                  top={
                                    actionBtnPosition === 'top'
                                      ? `-${arrBtn.length * 38}px`
                                      : '0px'
                                  }
                                />
                              )}
                            </Right>
                          </SubModule>
                          {subIndex + 1 < module?.subModules?.length ||
                          subModule?.assessment ? (
                            <Hr />
                          ) : (
                            ''
                          )}
                          {subModule?.assessment && (
                            <>
                              <SubModule
                                onClick={(e) =>
                                  handleSubModule(
                                    e,
                                    'assessment',
                                    subIndex,
                                    subModule?.assessment,
                                  )
                                }
                                data-testid="sub-module"
                              >
                                <Left $gap={'12px'}>
                                  <Img src={ICONS.ASSESSMENT} />
                                  <P
                                    $color="#000"
                                    $fontSize={'16px'}
                                    $fontWeight={'400'}
                                    $lineHeight={'normal'}
                                  >
                                    {subModule?.assessment?.assessmentTitle}
                                  </P>
                                </Left>
                                <Right $gap={'20px'}>
                                  <Img
                                    src={ICONS.THREE_DOTS}
                                    alt="three_dots"
                                    width={'16px'}
                                    height={'16px'}
                                    $isCursor={true}
                                    onClick={(e) =>
                                      handleThreeDotsAssessment(
                                        e,
                                        subIndex,
                                        subModule?.assessment,
                                      )
                                    }
                                  />

                                  {actionAssessOpen &&
                                    subModuleAssessIndex === subIndex && (
                                      <ActionButton
                                        arrBtn={arrBtnAssessment}
                                        setActionOpen={setActionAssessOpen}
                                        isLast={actionBtnPosition !== 'bottom'}
                                        top={
                                          actionBtnPosition === 'top'
                                            ? `-${arrBtnSubModule(show).length * 38}px`
                                            : '0px'
                                        }
                                      />
                                    )}
                                </Right>
                              </SubModule>
                              {subIndex + 1 < module?.subModules?.length ? (
                                <Hr />
                              ) : (
                                ''
                              )}
                            </>
                          )}
                        </Fragment>
                      );
                    })}
                  </ModuleOpen>
                )}
              </ModuleWrapper>
            );
          })}
        </StyledTableContainer>
      ) : (
        renderNoDataContainer()
      )}
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
    </>
  );
};
ModuleContainer.propTypes = {
  onClickFn: PropTypes.func.isRequired,
  onClickFnSub: PropTypes.func.isRequired,
  courseData: PropTypes.shape({
    modules: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        moduleTitle: PropTypes.string,
        noOfVideos: PropTypes.number,
        description: PropTypes.string,
        subModules: PropTypes.arrayOf(
          PropTypes.shape({
            _id: PropTypes.string.isRequired,
            subModuleTitle: PropTypes.string,
            description: PropTypes.string,
            imageUrl: PropTypes.string,
            videoUrl: PropTypes.string,
            duration: PropTypes.number,
            assessment: PropTypes.shape({
              assessmentTitle: PropTypes.string,
            }),
          }),
        ),
      }),
    ),
  }),
  setOpenSubModuleDrawer: PropTypes.func.isRequired,
  setOpenAssessmentDrawer: PropTypes.func.isRequired,
  setCourseSubModuleId: PropTypes.func.isRequired,
  setCourseModuleId: PropTypes.func.isRequired,
  setModuleObj: PropTypes.func.isRequired,
  setSubModuleObj: PropTypes.func.isRequired,
  setSubModuleData: PropTypes.func.isRequired,
  setAssessmentObj: PropTypes.func.isRequired,
  setOpenViewAssessmentDrawer: PropTypes.func.isRequired,
  setIsEditAssessment: PropTypes.func.isRequired,
  setIsViewSubmodule: PropTypes.func.isRequired,
  deleteCourseAssessmentMutation: PropTypes.func.isRequired,
  handleCsvUpload: PropTypes.func.isRequired,
};

export default ModuleContainer;
