import FieldDropdown from "@/app/(internalLayout)/_components/FieldDropdown";
import FieldInput from "@/app/(internalLayout)/_components/FieldInput";
import FileUploadJD from "./FileUploadJD";
import { DatePicker } from "antd";
import CalendarIcon from "@/assets/icons/jobs/calendarIcon.svg";
import Svg from "@/components/Svg";
import ErrorField from "@/app/(internalLayout)/_components/ErrorField";
import { Tooltip } from "@mui/material";
import InfoIcon from "@/assets/icons/jobs/infoIcon.svg";
import { formatDate } from "@/utils/helpers";
import dayjs from "dayjs";
import CustomTooltip from "@/components/CustomTooltip";

const JobDetailsSection = ({
  jobDetails,
  setJobDetails,
  errors,
  setErrors,
  jobCategories,
  jobDescriptionUrl,
  setJobDescriptionUrl,
  handleFieldUpdate,
}) => {
  const handleNoOfOpeningsChange = (value) => {
    // Allow only up to 5 digits (0-99999)
    if (!/^\d{0,5}$/.test(value)) return;

    handleFieldUpdate("noOfOpenings", value);
  };

  const handleJobCategorySelect = (value) => {
    const categoryEnum = jobCategories.find(
      (category) => category.value === value
    )?.key;
    handleFieldUpdate("category", categoryEnum);
  };

  const handleJobExpiryChange = (date, dateString) => {
    if (dateString) {
      setJobDetails((prev) => ({
        ...prev,
        jobExpiryDate: formatDate(dateString, "DD MMM YYYY"),
      }));
      setErrors((prev) => ({
        ...prev,
        jobExpiryDate: "",
      }));
    } else {
      setJobDetails((prev) => ({
        ...prev,
        jobExpiryDate: "",
      }));
      setErrors((prev) => ({
        ...prev,
        jobExpiryDate: "Please select a valid date",
      }));
    }
  };

  const getJobCategoryValue = (key) => {
    const category = jobCategories.find((category) => category.key === key);
    return category?.value;
  };
  return (
    <div>
      <div className="bg-white rounded-lg pt-3 px-6 pb-3 mb-3">
        <h2 className="text-[18px] font-medium mb-5 text-[#111]">
          Job details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <FieldInput
              isRequired
              label="Job Title"
              placeholder="Enter job title"
              value={jobDetails?.jobRole}
              handleChange={(value) => handleFieldUpdate("jobRole", value)}
              isError={errors?.jobRole}
              errorText={errors?.jobRole}
              inputBg={"#FFF"}
              labelClasses={"font-medium text-[#111]"}
            />
          </div>

          <FieldDropdown
            isRequired
            errorText={errors?.category}
            isError={errors?.category}
            label="Job Category"
            options={jobCategories}
            value={
              getJobCategoryValue(jobDetails?.category) || "Select Category"
            }
            handleChange={(value) => handleJobCategorySelect(value)}
            inputBg={"#FFF"}
            className={"text-[#111]"}
          />

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block text-[#111] flex gap-1 items-center">
              Job Description{" "}
              <p className="text-[10px] leading-[11px] text-[#B7B7B7] font-medium italic">
                (Optional)
              </p>
            </label>
            <textarea
              rows="3"
              placeholder="Briefly describe responsibilities, qualifications, or perks..."
              className="bg-[#FFF] text-[#585858] border border-[#BAC8D3] font-normal rounded-lg px-5 py-2 text-sm w-full resize-none shadow-tiny"
              value={jobDetails?.description}
              onChange={(e) => handleFieldUpdate("description", e.target.value)}
            ></textarea>
          </div>
          {/* JD Upload Button */}
          <div className="md:col-span-2 -mt-4">
            <FileUploadJD
              jobDescriptionUrl={jobDescriptionUrl}
              setJobDescriptionUrl={setJobDescriptionUrl}
            />
          </div>

          {/* Number of Vacancies */}
          <div className="md:col-span-1">
            <FieldInput
              isRequired
              errorText={errors?.noOfOpenings}
              className="text-sm font-normal mb-1 block text-[#111]"
              isError={errors?.noOfOpenings}
              label="Number of Vacancies"
              placeholder="Enter number of vacancies"
              value={jobDetails?.noOfOpenings}
              handleChange={(value) => handleNoOfOpeningsChange(value)}
              inputBg={"#FFF"}
              labelClasses={"font-medium"}
            />
          </div>
          {/* Job Expiry Date */}
          <div className="">
            <label className="flex text-sm font-medium mb-2 block text-[#111] gap-1">
              Job Expiry{" "}
              <CustomTooltip
                title="After this date, new applications won’t be accepted, but you can still shortlist the ones received before."
                placement="top"
              >
                <InfoIcon />
              </CustomTooltip>{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className=" border-[#F2F2F2]">
              <DatePicker
                prefix={
                  <Svg
                    icon={<CalendarIcon />}
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                  />
                }
                onChange={handleJobExpiryChange}
                picker="day"
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
                placeholder="End Date"
                style={{
                  padding: "12px",
                  width: "100%",
                  borderColor: errors?.jobExpiryDate ? "#FF0000" : "#E9EFF4",
                }}
              />
              {errors?.jobExpiryDate && (
                <ErrorField errorText={errors?.jobExpiryDate} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsSection;
