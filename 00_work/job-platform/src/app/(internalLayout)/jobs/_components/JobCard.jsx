import CustomCTA from "@/components/CustomCTA";
import CountBox from "./CountBox";
import JobDetails from "./JobDetails";
import { APPLICATION_STAGES } from "@/constants";
import { useState } from "react";
import DisplayDrawer from "@/components/Drawer";
import { JobDetailsDrawer } from "./JobDetailsDrawer";
import Link from "next/link";

const JobCard = ({
  job,
  jobData,
  dailyApplicationCount = 0,
  dailyInterviewCompletedCount = 0,
}) => {
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col border border-[#D8D8D8] rounded-[10px] bg-white my-3">
      <JobDetails
        job={job}
        setIsDetailsDrawerOpen={setIsDetailsDrawerOpen}
        dailyApplicationCount={dailyApplicationCount}
        dailyInterviewCompletedCount={dailyInterviewCompletedCount}
      />
      <div className="px-5 pb-5">
        {!(job?.status === "DRAFT" || job?.status === "IN_REVIEW") ? (
          <div className="flex flex-col justify-start md:flex-row gap-3 justify-between items-center">
            <div className="w-full flex flex-col md:flex-row gap-4">
              {APPLICATION_STAGES.map(
                ({
                  key,
                  label,
                  redirectTo,
                  pill,
                  totalCountLabel,
                  totalCountKey,
                }) => (
                  <CountBox
                    key={key}
                    count={job[key] || 0}
                    text={label}
                    job={job}
                    tabIndex={redirectTo}
                    pill={pill}
                    disabled={job?.noOfApplications === 0}
                    totalCountLabel={totalCountLabel}
                    totalCount={job[totalCountKey]}
                  />
                )
              )}
            </div>

            <Link
              href={job?.noOfApplications !== 0 ? `/jobs/${job.jobId}` : "#"}
            >
              <CustomCTA
                title="View Applications"
                backgroundColor="#ffffff"
                textColor="#141482"
                disabled={job?.noOfApplications === 0}
                disabledBgColor="#fff"
              />
            </Link>
          </div>
        ) : null}

        <DisplayDrawer
          widthClass="w-full md:w-[470px]"
          open={isDetailsDrawerOpen}
          onClose={() => setIsDetailsDrawerOpen(false)}
          title="Job Details"
        >
          <JobDetailsDrawer jobData={jobData} />
        </DisplayDrawer>
      </div>
    </div>
  );
};

export default JobCard;
