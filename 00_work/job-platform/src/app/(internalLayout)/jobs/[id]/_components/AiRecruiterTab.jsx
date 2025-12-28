"use client";
import { useContext, useEffect, useState } from "react";
import { convertToTableData, parseTableHeaders } from "@/utils/helpers";
import DisplayDrawer from "@/components/Drawer";
import CustomCTA from "@/components/CustomCTA";
import DisplayTable from "@/components/DisplayTable";
import {
  useGetEmployerDetails,
  useGetJobApplications,
  usePutBulkStatusUpdate,
  usePutJobApplication,
} from "@/apis/queryHooks";
import { useParams } from "next/navigation";
import RejectIcon from "@/assets/icons/jobs/rejectIcon.svg";
import ViewIcon from "@/assets/icons/common/greyEye.svg";
import ApplicationVideoDrawer from "./ApplicationVideoDrawer";
import { useSnackbar } from "notistack";
import RejectApplicationModal from "./RejectApplicationModal";
import DisplayPagination from "@/components/DisplayPagination";
import { CURRENT_JOB_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import DisplayCard from "@/components/DisplayCard";
import BulkMoveFooter from "./BulkMoveFooter";
import { EmployerContext } from "@/providers/EmployerProvider";
import FinaliseModal from "./FinaliseModal";
import Loader from "@/components/Loader";
import EmptyAiInterview from "@/assets/icons/jobs/emptyAiInterview.svg";
import TableInfoBanner from "./TableInfoBanner";
import NotEnoughCreditBanner from "./NotEnoughCreditBanner";
import { parseCookies } from "nookies";

export default function AiRecruiterTab({ refetchJobData }) {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const { id } = params;
  const { employer, setEmployer } = useContext(EmployerContext);
  const employerId = employer?._id || "";
  const [currentPage, setCurrentPage] = useState(CURRENT_JOB_PAGE);
  const [isViewApplication, setIsViewApplication] = useState(false);
  const [actionIndex, setActionIndex] = useState(null);
  const [isApplicationVideoDrawerOpen, setIsApplicationDrawerOpen] =
    useState(false);
  const [loadingRow, setLoadingRow] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedActionIndices, setSelectedActionIndices] = useState([]);
  const [isFinaliseModalOpen, setIsFinaliseModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const cookies = parseCookies();

  const {
    data: employerData,
    status: employerStatus,
    refetch: refetchEmployerData,
  } = useGetEmployerDetails({
    userId: cookies?.userId,
    enabled: false,
  });

  const {
    data: jobApplicationsData,
    refetch: refetchJobApplicationsData,
    status: jobApplicationsStatus,
    fetchStatus: jobApplicationsFetchStatus,
  } = useGetJobApplications(id, {
    status: "SHORTLISTED",
    pageNo: currentPage,
    pageSize: itemsPerPage,
  });

  const {
    mutateAsync: putApplicationStatusChange,
    status: putApplicationStatus,
  } = usePutJobApplication();

  const { mutateAsync: putBulkStatusUpdate } = usePutBulkStatusUpdate();

  useEffect(() => {
    if (employerStatus === "success") {
      setEmployer(employerData);
    }
  }, [employerStatus]);

  const arrBtn = [
    {
      text: "View Application Details",
      icon: <ViewIcon />,
      active: true,
      isVisible: true,
      color: "#586276",
      iconHeight: "16px",
      iconWidth: "16px",
      onClick: (e) => {
        e.stopPropagation();
        setIsViewApplication(true);
        setIsApplicationDrawerOpen(true);
      },
    },
    {
      text: "Reject",
      icon: <RejectIcon />,
      active: true,
      isVisible: true,
      color: "#586276",
      iconHeight: "16px",
      iconWidth: "16px",
      onClick: (e) => {
        e.stopPropagation();
        setIsRejectModalOpen(true);
      },
    },
  ];
  const ShortlistCTA = ({ currentIndex, type = "web" }) => {
    const currentJobId =
      jobApplicationsData?.customerJobApplications?.[currentIndex]?._id;
    return (
      <CustomCTA
        title="Finalize & View Phone No."
        backgroundColor="#ffffff"
        borderColor="#32B237"
        borderRadius="8px"
        textColor="#32B237"
        width={type === "web" ? "85%" : "90%"}
        height={type === "web" ? "29px" : "40px"}
        hoverBgColor="#32B237"
        hoverTextColor="#ffffff"
        hoverBorderColor="#32B237"
        loading={
          putApplicationStatus === "pending" && loadingRow === currentJobId
        }
        disabled={
          (putApplicationStatus === "pending" && loadingRow === currentJobId) ||
          jobApplicationsData?.customerJobApplications?.[currentIndex]
            ?.interviewStatus !== "COMPLETED" ||
          !isHireable(
            jobApplicationsData?.customerJobApplications?.[currentIndex]
          ) ||
          !jobApplicationsData?.customerJobApplications?.[currentIndex]
            ?.interviewVideoLink
        }
        onClickFn={() => {
          jobApplicationsData?.customerJobApplications?.[currentIndex]?._id
            ? handleApplicationStatusChange(currentJobId, "HIRED")
            : null;
        }}
      />
    );
  };

  const getSuccessMessage = (count, status) => {
    const verb = status === "HIRED" ? "finalised successfully" : "rejected";
    const plural = count > 1 ? "Candidates have" : "Candidate has";
    return `${count} ${plural} been ${verb}`;
  };

  const handleApplicationStatusChange = (customerJobId, status) => {
    setLoadingRow(customerJobId);

    const handleStatusUpdate =
      status === "HIRED" ? putBulkStatusUpdate : putApplicationStatusChange;

    const apiParams =
      status === "HIRED"
        ? { customerJobIds: [customerJobId], status, employerId }
        : { customerJobId, status, employerId };

    handleStatusUpdate(apiParams)
      .then(() => {
        refetchJobApplicationsData();
        refetchJobData();
        refetchEmployerData();
        setSelectedActionIndices((prev) =>
          prev.filter((id) => id !== customerJobId)
        );
        setIsApplicationDrawerOpen(false);
        enqueueSnackbar(getSuccessMessage(1, status), { variant: "success" });
        if (status === "HIRED") setIsFinaliseModalOpen(true);
      })
      .catch(() => {
        enqueueSnackbar("Failed to update application status", {
          variant: "error",
        });
      })
      .finally(() => {
        setLoadingRow(null);
      });
  };

  const isHireable = (item) => {
    return (
      employer?.maxCandidatesToBeHired > 0 &&
      item?.daysLeftToFinalised !== "---" &&
      item?.daysLeftToFinalised !== "EXPIRED" &&
      item?.interviewStatus === "COMPLETED" &&
      !!item?.interviewVideoLink
    );
  };

  if (
    jobApplicationsStatus === "pending" ||
    jobApplicationsFetchStatus === "fetching" ||
    !jobApplicationsData?.customerJobApplications
  ) {
    return <Loader />;
  }

  const headers = parseTableHeaders(jobApplicationsData?.headers);
  const parsedData = convertToTableData(
    jobApplicationsData?.customerJobApplications,
    headers
  );

  const hireableCandidates = parsedData?.filter((item) => isHireable(item));

  const handleFinaliseModalClose = () => {
    setIsFinaliseModalOpen(false);
    setIsApplicationDrawerOpen(false);
  };

  const handleTableDeselect = () => {
    setSelectedActionIndices([]);
  };

  const handleBulkStatusChange = () => {
    if (!selectedActionIndices?.length) return;
    const count = selectedActionIndices?.length;
    putBulkStatusUpdate({
      customerJobIds: selectedActionIndices,
      status: "HIRED",
      employerId: employerId,
    })
      .then(() => {
        setSelectedActionIndices([]);
        refetchJobApplicationsData();
        refetchEmployerData();
        refetchJobData();
        enqueueSnackbar(getSuccessMessage(count, "HIRED"), {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("Failed to update application status", {
          variant: "error",
        });
      });
  };

  const handleSelectAllCards = () => {
    if (selectedActionIndices?.length === hireableCandidates?.length) {
      setSelectedActionIndices([]);
    } else {
      const maxSelectItems = hireableCandidates?.length || 0;
      const parsedDataWithHireable = hireableCandidates?.slice(
        0,
        maxSelectItems
      );
      setSelectedActionIndices(
        parsedDataWithHireable?.map((item) => item.id) || []
      );
    }
  };

  return (
    <div className="py-5 relative">
      <div className="min-h-[calc(100vh-400px)]">
        <FinaliseModal
          isFinaliseModalOpen={isFinaliseModalOpen}
          handleFinaliseModalClose={handleFinaliseModalClose}
        />
        <TableInfoBanner
          maxCandidatesToBeHired={employer?.maxCandidatesToBeHired}
        />

        <div className="hidden md:block">
          <DisplayTable
            isMultiSelect
            setSelectedActionIndices={setSelectedActionIndices}
            selectedActionIndices={selectedActionIndices}
            maxSelectItems={hireableCandidates?.length || 0}
            tableData={jobApplicationsData?.customerJobApplications ?? []}
            headers={headers}
            rows={parsedData}
            arrBtn={arrBtn}
            actionIndex={actionIndex}
            setActionIndex={setActionIndex}
            showActionsPanel
            emptyIcon={<EmptyAiInterview />}
            emptyDataMessage={
              <>
                All sorted for now.
                <br />
                Once you shortlist more, Interviews will appear here.
              </>
            }
            customProps={{
              isHireable,
              ElementToBeRenderedInAction: ShortlistCTA,
              setIsApplicationDrawerOpen,
              setIsViewApplication,
              showRecommnedation: true,
            }}
          />
        </div>
        <div className="md:hidden">
          <DisplayCard
            isMultiSelect
            setSelectedActionIndices={setSelectedActionIndices}
            selectedActionIndices={selectedActionIndices}
            maxSelectItems={hireableCandidates?.length || 0}
            tableData={jobApplicationsData?.customerJobApplications ?? []}
            headers={headers}
            rows={parsedData}
            arrBtn={arrBtn}
            actionIndex={actionIndex}
            setActionIndex={setActionIndex}
            showActionsPanel
            emptyIcon={<EmptyAiInterview />}
            emptyDataMessage={
              <>
                All sorted for now.
                <br />
                Once you shortlist more, Interviews will appear here.
              </>
            }
            customProps={{
              isHireable,
              ElementToBeRenderedInAction: ShortlistCTA,
              setIsApplicationDrawerOpen,
              setIsViewApplication,
              showRecommnedation: true,
            }}
          />
        </div>
        <DisplayDrawer
          widthClass="w-screen md:w-[470px]"
          open={isApplicationVideoDrawerOpen}
          onClose={() => setIsApplicationDrawerOpen(false)}
          title={`${
            isViewApplication ? "Application details" : "Interview details"
          }`}
        >
          <ApplicationVideoDrawer
            customerJobId={
              jobApplicationsData?.customerJobApplications?.[actionIndex]?._id
            }
            videoLink={
              isViewApplication
                ? jobApplicationsData?.customerJobApplications?.[actionIndex]
                    ?.customerBioDataVideo
                : parsedData[actionIndex]?.interviewVideoLink
            }
            handleApplicationStatusChange={handleApplicationStatusChange}
            handleMovetoNewStage={() =>
              handleApplicationStatusChange(
                jobApplicationsData?.customerJobApplications?.[actionIndex]
                  ?._id,
                "HIRED"
              )
            }
            name={parsedData[actionIndex]?.customerName}
            location={parsedData[actionIndex]?.userLocation}
            interviewScore={parsedData[actionIndex]?.totalScore}
            profileScore={
              jobApplicationsData?.customerJobApplications?.[actionIndex]
                ?.jobReelScore
            }
            certificates={
              jobApplicationsData?.customerJobApplications?.[actionIndex]
                ?.certificateInformation
            }
            rating={
              jobApplicationsData?.customerJobApplications?.[actionIndex]
                ?.rating
            }
            isRecommended={
              jobApplicationsData?.customerJobApplications?.[actionIndex]
                ?.isRecommended
            }
            status={putApplicationStatus}
            changeStatusReject={"INTERVIEW_REJECTED"}
            changeStatusShortlist={"HIRED"}
            shortlistBtnText="Finalize & View Phone No."
            disabledShortlistBtn={
              !parsedData[actionIndex]?.interviewVideoLink ||
              !isHireable(parsedData[actionIndex])
            }
          />
        </DisplayDrawer>
        <RejectApplicationModal
          isRejectModalOpen={isRejectModalOpen}
          setIsRejectModalOpen={setIsRejectModalOpen}
          candidateName={
            jobApplicationsData?.customerJobApplications?.[actionIndex]
              ?.customerName
          }
          handleRejectNowClick={() => {
            setIsRejectModalOpen(false);
            handleApplicationStatusChange(
              jobApplicationsData?.customerJobApplications?.[actionIndex]?._id,
              "INTERVIEW_REJECTED"
            );
          }}
        />
      </div>
      <div className="flex z-[20] flex-col fixed left-0 md:left-[270px] right-0 bottom-0">
        <NotEnoughCreditBanner
          selectedCandidatesLength={selectedActionIndices?.length}
          maxCandidatesToBeHired={employer?.maxCandidatesToBeHired}
        />
        <BulkMoveFooter
          selectedCandidatesLength={selectedActionIndices?.length}
          handleCTAClick={handleBulkStatusChange}
          handleDeselect={handleTableDeselect}
          ctaText="Finalize & View Phone No."
          isCTAdisabled={
            selectedActionIndices?.length > employer?.maxCandidatesToBeHired
          }
          isSelectAllDisabled={hireableCandidates?.length === 0}
          isSelectAllChecked={
            selectedActionIndices?.length === hireableCandidates?.length
          }
          handleSelectAllCards={handleSelectAllCards}
        />
      </div>
      {parsedData.length > 0 ? (
        <div className="flex z-[10] mt-5 w-full bottom-10 p-2 bg-white border rounded-[10px] mb-[82px] md:mb-0">
          <DisplayPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={jobApplicationsData?.noOfApplications}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      ) : null}
    </div>
  );
}
