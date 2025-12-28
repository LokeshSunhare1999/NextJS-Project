"use client";
import { useState } from "react";
import { convertToTableData, parseTableHeaders } from "@/utils/helpers";
import DisplayDrawer from "@/components/Drawer";
import DisplayTable from "@/components/DisplayTable";
import { useGetJobApplications } from "@/apis/queryHooks";
import { useParams } from "next/navigation";
import ViewIcon from "@/assets/icons/common/greyEye.svg";
import ApplicationVideoDrawer from "./ApplicationVideoDrawer";
import DisplayPagination from "@/components/DisplayPagination";
import { CURRENT_JOB_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import DisplayCard from "@/components/DisplayCard";
import Loader from "@/components/Loader";
import EmptyFinal from "@/assets/icons/jobs/emptyFinal.svg";

export default function FinalTab() {
  const params = useParams();
  const { id } = params;
  const [isViewApplication, setIsViewApplication] = useState(false);
  const [actionIndex, setActionIndex] = useState(null);
  const [isApplicationVideoDrawerOpen, setIsApplicationDrawerOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(CURRENT_JOB_PAGE);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);

  const {
    data: jobApplicationsData,
    refetch: refetchJobApplicationsData,
    status: jobApplicationsStatus,
    fetchStatus: jobApplicationsFetchStatus,
  } = useGetJobApplications(id, {
    status: "FINAL",
    pageNo: currentPage,
    pageSize: itemsPerPage,
  });

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
      text: "View Interview Details",
      icon: <ViewIcon />,
      active: true,
      isVisible:
        jobApplicationsData?.customerJobApplications?.[actionIndex]
          ?.interviewVideoLink,
      color: "#586276",
      iconHeight: "16px",
      iconWidth: "16px",
      onClick: (e) => {
        e.stopPropagation();
        setIsViewApplication(false);
        setIsApplicationDrawerOpen(true);
      },
    },
  ];

  const headers = parseTableHeaders(jobApplicationsData?.headers);
  const parsedData = convertToTableData(
    jobApplicationsData?.customerJobApplications,
    headers
  );

  if (
    jobApplicationsStatus === "pending" ||
    jobApplicationsFetchStatus === "fetching" ||
    !jobApplicationsData?.customerJobApplications
  ) {
    return <Loader />;
  }

  return (
    <div className="py-5">
      <div className="min-h-[calc(100vh-400px)]">
        <div className="hidden md:block">
          <DisplayTable
            tableData={jobApplicationsData?.customerJobApplications ?? []}
            headers={headers}
            rows={parsedData}
            arrBtn={arrBtn}
            actionIndex={actionIndex}
            setActionIndex={setActionIndex}
            showActionsPanel
            emptyIcon={<EmptyFinal />}
            emptyDataMessage={
              <>
                No one finalised yet.
                <br />
                If interviews are done, review and move
                <br />
                candidates here from the Interview tab.
              </>
            }
            customProps={{
              setIsApplicationDrawerOpen,
              showRecommnedation: false,
            }}
          />
        </div>
        <div className="md:hidden">
          <DisplayCard
            isplayTable
            tableData={jobApplicationsData?.customerJobApplications ?? []}
            headers={headers}
            rows={parsedData}
            arrBtn={arrBtn}
            actionIndex={actionIndex}
            setActionIndex={setActionIndex}
            showActionsPanel
            emptyIcon={<EmptyFinal />}
            emptyDataMessage={
              <>
                No one finalised yet.
                <br />
                If interviews are done, review and move
                <br />
                candidates here from the Interview tab.
              </>
            }
            customProps={{
              setIsApplicationDrawerOpen,
              showRecommnedation: false,
            }}
          />
        </div>
        <DisplayDrawer
          open={isApplicationVideoDrawerOpen}
          onClose={() => setIsApplicationDrawerOpen(false)}
          title={`${
            isViewApplication ? "Application details" : "Interview details"
          }`}
          widthClass="w-screen md:w-[470px]"
        >
          <ApplicationVideoDrawer
            customerJobId={
              jobApplicationsData?.customerJobApplications?.[actionIndex]?._id
            }
            videoLink={
              isViewApplication
                ? jobApplicationsData?.customerJobApplications?.[actionIndex]
                    ?.customerBioDataVideo
                : jobApplicationsData?.customerJobApplications?.[actionIndex]
                    ?.interviewVideoLink
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
            showCta={false}
          />
        </DisplayDrawer>
      </div>
      {parsedData.length > 0 ? (
        <div className="flex mt-5 w-full bottom-10 p-2 bg-white border rounded-[10px]">
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
