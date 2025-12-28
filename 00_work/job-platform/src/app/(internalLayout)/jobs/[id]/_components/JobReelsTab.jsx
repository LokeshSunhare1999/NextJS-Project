"use client";
import { useState, useContext, useRef, Suspense, lazy, useEffect } from "react";
import { convertToTableData, parseTableHeaders } from "@/utils/helpers";
import DisplayDrawer from "@/components/Drawer";
import CustomCTA from "@/components/CustomCTA";
import DisplayTable from "@/components/DisplayTable";
import {
  useGetJobApplications,
  usePutBulkStatusUpdate,
  usePutJobApplication,
} from "@/apis/queryHooks";
import { useParams } from "next/navigation";
import RejectIcon from "@/assets/icons/jobs/rejectIcon.svg";
import ApplicationVideoDrawer from "./ApplicationVideoDrawer";
import { useSnackbar } from "notistack";
import RejectApplicationModal from "./RejectApplicationModal";
import DisplayPagination from "@/components/DisplayPagination";
import { CURRENT_JOB_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import { EmployerContext } from "@/providers/EmployerProvider";
import DisplayCard from "@/components/DisplayCard";
import BulkMoveFooter from "./BulkMoveFooter";
import Loader from "@/components/Loader";
import PendingIcon from "@/assets/icons/common/pendingIcon.svg";
import InreviewIcon from "@/assets/icons/common/inreviewIcon.svg";
import Reject from "@/assets/icons/common/rejectIcon.svg";
import EmptyJobReel from "@/assets/icons/jobs/emptyJobReel.svg";
import { useRouter } from "next/navigation";

const VerificationStatusModal = lazy(() =>
  import("../../_components/VerificationStatusModal")
);

export default function JobReelsTab({ refetchJobData }) {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [loadingRow, setLoadingRow] = useState(null);
  const [actionIndex, setActionIndex] = useState(null);
  const [selectedActionIndices, setSelectedActionIndices] = useState([]);
  const [isApplicationVideoDrawerOpen, setIsApplicationDrawerOpen] =
    useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(CURRENT_JOB_PAGE);
  const [isVerificationRejectModalOpen, setIsVerificationRejectModalOpen] =
    useState(false);
  const [isVerificationPendingModalOpen, setIsVerificationPendingModalOpen] =
    useState(false);
  const [isVerificationInReviewModalOpen, setIsVerificationInReviewModalOpen] =
    useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);

  const isBulkMoveCtaClicked = useRef(false);

  const { employer } = useContext(EmployerContext);
  const employerId = employer?._id || "";
  const {
    data: jobApplicationsData,
    refetch: refetchJobApplicationsData,
    status: jobApplicationsStatus,
    fetchStatus: jobApplicationsFetchStatus,
  } = useGetJobApplications(id, {
    status: "APPLIED",
    pageNo: currentPage,
    pageSize: itemsPerPage,
  });

  const {
    mutateAsync: putApplicationStatusChange,
    status: putSingleApplicationStatus,
  } = usePutJobApplication();

  const { mutateAsync: putBulkStatusUpdate, status: putApplicationStatus } =
    usePutBulkStatusUpdate();

  useEffect(() => {
    router.prefetch("/account-verification");
  }, []);

  const arrBtn = [
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
        handleMoveToAiRecruiterModalOpen(false, () =>
          setIsRejectModalOpen(true)
        );
      },
    },
  ];

  const handleMoveToAIRecruiter = (currentIndex, currentJobId) => {
    const application =
      jobApplicationsData?.customerJobApplications?.[currentIndex];

    if (!application?._id) return;

    handleApplicationStatusChange(currentJobId, "SHORTLISTED");
  };

  const ShortlistCTA = ({ currentIndex, type = "web" }) => {
    const currentJobId =
      jobApplicationsData?.customerJobApplications?.[currentIndex]?._id;
    const daysLeftToShortlist = jobApplicationsData?.daysLeftToShortlist;
    return (
      <CustomCTA
        title="Move to AI Recruiter"
        backgroundColor="#ffffff"
        borderColor="#32B237"
        borderRadius="8px"
        textColor="#32B237"
        width={type === "web" ? "60%" : "90%"}
        height={type === "web" ? "29px" : "40px"}
        hoverBgColor="#32B237"
        hoverTextColor="#ffffff"
        hoverBorderColor="#32B237"
        loading={
          putApplicationStatus === "pending" && loadingRow === currentJobId
        }
        disabled={
          (putApplicationStatus === "pending" && loadingRow === currentJobId) ||
          daysLeftToShortlist === 0
        }
        onClickFn={() =>
          handleMoveToAiRecruiterModalOpen(false, () =>
            handleMoveToAiClick(currentIndex)
          )
        }
      />
    );
  };

  const handleApplicationStatusChange = (customerJobId, status) => {
    setLoadingRow(customerJobId);

    const handleStatusUpdate =
      status === "SHORTLISTED"
        ? putBulkStatusUpdate
        : putApplicationStatusChange;

    const apiParams =
      status === "SHORTLISTED"
        ? { customerJobIds: [customerJobId], status, employerId }
        : { customerJobId, status, employerId };

    handleStatusUpdate(apiParams)
      .then(() => {
        refetchJobApplicationsData();
        refetchJobData();
        setIsApplicationDrawerOpen(false);
        setSelectedActionIndices((prev) =>
          prev.filter((id) => id !== customerJobId)
        );
        const successMessage =
          status === "SHORTLISTED"
            ? "1 application has been moved to AI Recruiter successfully"
            : "Application has been rejected";
        enqueueSnackbar(successMessage, {
          variant: "success",
        });
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

  const handleMoveToAiRecruiterModalOpen = (
    isBulk,
    onVerificationCompleteFn
  ) => {
    isBulkMoveCtaClicked.current = isBulk;
    setIsApplicationDrawerOpen(false);
    switch (employer?.verificationStatus) {
      case "REJECTED":
        setIsVerificationRejectModalOpen(true);
        return;
      case "NOT_INITIATED":
        setIsVerificationPendingModalOpen(true);
        return;
      case "PENDING":
        setIsVerificationInReviewModalOpen(true);
        return;
      case "VERIFIED":
        onVerificationCompleteFn();
        return;
      default:
        enqueueSnackbar(
          "We couldn't process your request to shortlist. Please contact our support team for assistance.",
          { variant: "error" }
        );
    }
  };

  const handleBulkStatusChange = (status = "SHORTLISTED") => {
    if (!selectedActionIndices?.length) return;

    putBulkStatusUpdate({
      customerJobIds: selectedActionIndices,
      status: "SHORTLISTED",
      employerId: employerId,
    })
      .then(() => {
        refetchJobApplicationsData();
        refetchJobData();
        setSelectedActionIndices([]);
        const successMessage =
          status === "SHORTLISTED"
            ? `${selectedActionIndices.length} applications have been moved to AI Recruiter successfully`
            : `1 application have been rejected`;
        enqueueSnackbar(successMessage, {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("Failed to update application status", {
          variant: "error",
        });
      });
  };

  const headers = parseTableHeaders(jobApplicationsData?.headers);
  const parsedData = convertToTableData(
    jobApplicationsData?.customerJobApplications,
    headers
  );

  const handleTableDeselect = () => {
    setSelectedActionIndices([]);
  };

  const handleMoveToAiClick = (currentIndex = actionIndex) => {
    const currentJobId =
      jobApplicationsData?.customerJobApplications?.[currentIndex]?._id;
    handleMoveToAIRecruiter(currentIndex, currentJobId);
  };

  const handleSelectAllCards = () => {
    if (selectedActionIndices?.length === parsedData?.length) {
      setSelectedActionIndices([]);
    } else {
      setSelectedActionIndices(parsedData.map((item) => item.id));
    }
  };

  const isHireable = (item) => jobApplicationsData?.daysLeftToShortlist > 0;

  const handleVerificationModalClick = () => {
    router.push("/account-verification");
  };
  const verificationModals = [
    {
      isOpen: isVerificationRejectModalOpen,
      handleClose: () => setIsVerificationRejectModalOpen(false),
      heading: "Verification Failed",
      description:
        "Your business details didn’t pass verification. Shortlisting is only available after successful verification.",
      handleClick: handleVerificationModalClick,
      actionCtaText: "Resubmit Details",
      icon: <Reject />,
    },
    {
      isOpen: isVerificationPendingModalOpen,
      handleClose: () => setIsVerificationPendingModalOpen(false),
      heading: "Verification Pending",
      description:
        "You can shortlist candidates only after business verification.",
      handleClick: handleVerificationModalClick,
      actionCtaText: "Proceed to Verification",
      icon: <PendingIcon />,
    },
    {
      isOpen: isVerificationInReviewModalOpen,
      handleClose: () => setIsVerificationInReviewModalOpen(false),
      heading: "Verification In-review",
      description:
        "We’ll review your details within 24 hours. You can start shortlisting once it’s done.",
      handleClick: () => setIsVerificationInReviewModalOpen(false),
      actionCtaText: "Okay, Got it",
      icon: <InreviewIcon />,
    },
  ];

  if (
    jobApplicationsStatus === "pending" ||
    jobApplicationsFetchStatus === "fetching" ||
    !jobApplicationsData?.customerJobApplications
  ) {
    return <Loader />;
  }

  return (
    <div className="relative py-5">
      <div className="min-h-[calc(100vh-400px)]">
        <Suspense fallback={<div></div>}>
          {verificationModals.map((modal, index) => (
            <VerificationStatusModal
              key={index}
              isOpen={modal.isOpen}
              handleClose={modal.handleClose}
              heading={modal.heading}
              description={modal.description}
              handleClick={modal.handleClick}
              actionCtaText={modal.actionCtaText}
              icon={modal.icon}
            />
          ))}
        </Suspense>
        <div className="hidden md:block">
          <DisplayTable
            isMultiSelect
            setSelectedActionIndices={setSelectedActionIndices}
            selectedActionIndices={selectedActionIndices}
            maxSelectItems={parsedData?.length || 0}
            tableData={jobApplicationsData?.customerJobApplications ?? []}
            headers={headers}
            rows={parsedData}
            arrBtn={arrBtn}
            actionIndex={actionIndex}
            setActionIndex={setActionIndex}
            showActionsPanel
            emptyIcon={<EmptyJobReel />}
            emptyDataMessage={
              <>
                No more applications here.
                <br />
                New ones will appear here as they come in.
              </>
            }
            customProps={{
              isHireable,
              ElementToBeRenderedInAction: ShortlistCTA,
              setIsApplicationDrawerOpen,
              showRecommnedation: true,
            }}
          />
        </div>
        <div className="md:hidden">
          <DisplayCard
            isMultiSelect
            setSelectedActionIndices={setSelectedActionIndices}
            selectedActionIndices={selectedActionIndices}
            maxSelectItems={parsedData?.length || 0}
            tableData={jobApplicationsData?.customerJobApplications ?? []}
            headers={headers}
            rows={parsedData}
            arrBtn={arrBtn}
            actionIndex={actionIndex}
            setActionIndex={setActionIndex}
            showActionsPanel
            emptyIcon={<EmptyJobReel />}
            emptyDataMessage={
              <>
                No more applications here.
                <br />
                New ones will appear here as they come in.
              </>
            }
            customProps={{
              ElementToBeRenderedInAction: ShortlistCTA,
              setIsApplicationDrawerOpen,
              showRecommnedation: true,
            }}
          />
        </div>
        <DisplayDrawer
          open={isApplicationVideoDrawerOpen}
          onClose={() => setIsApplicationDrawerOpen(false)}
          title={"Application details"}
          widthClass="w-screen md:w-[470px]"
        >
          <ApplicationVideoDrawer
            customerJobId={
              jobApplicationsData?.customerJobApplications?.[actionIndex]?._id
            }
            videoLink={parsedData[actionIndex]?.customerBioDataVideo}
            handleApplicationStatusChange={handleApplicationStatusChange}
            handleMovetoNewStage={() =>
              handleMoveToAiRecruiterModalOpen(false, handleMoveToAiClick)
            }
            currentIndex={actionIndex}
            name={parsedData[actionIndex]?.customerName}
            location={parsedData[actionIndex]?.userLocation}
            profileScore={parsedData[actionIndex]?.jobReelScore}
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
            changeStatusReject={"SCREENING_REJECTED"}
            changeStatusShortlist={"SHORTLISTED"}
            shortlistBtnText="Move to AI Recruiter"
            disabledShortlistBtn={
              jobApplicationsData?.daysLeftToShortlist === 0
            }
            tab={0}
            handleRejectNowClick={() =>
              handleMoveToAiRecruiterModalOpen(false, () =>
                setIsRejectModalOpen(true)
              )
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
              "SCREENING_REJECTED"
            );
          }}
        />
      </div>
      <div className="flex flex-col fixed left-0 md:left-[270px] right-0 bottom-0 z-[20]">
        <BulkMoveFooter
          selectedCandidatesLength={selectedActionIndices?.length}
          handleDeselect={handleTableDeselect}
          handleCTAClick={() =>
            handleMoveToAiRecruiterModalOpen(true, handleBulkStatusChange)
          }
          ctaText="Move to AI Recruiter"
          isSelectAllDisabled={parsedData?.length === 0}
          isSelectAllChecked={
            selectedActionIndices?.length === parsedData?.length
          }
          handleSelectAllCards={handleSelectAllCards}
        />
      </div>
      {parsedData.length > 0 ? (
        <div className="z-[10] flex mt-5 w-full bottom-10 p-2 bg-white border rounded-[10px] mb-[188px] md:mb-0">
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
