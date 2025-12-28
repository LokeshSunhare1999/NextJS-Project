import CustomTooltip from "@/components/CustomTooltip";
import InfoIcon from "@/assets/icons/jobs/infoIcon.svg";
import FieldInput from "@/app/(internalLayout)/_components/FieldInput";
import { isValidMobileNo } from "@/utils/helpers";

const PocSection = ({ jobDetails, errors, handleFieldUpdate }) => {
  const handleRecruiterPhoneChange = (value) => {
    if (!isValidMobileNo(value)) return;
    handleFieldUpdate("recruiterPhoneNumber", value);
  };
  return (
    <div>
      <div className="bg-white rounded-lg pt-3 px-6 pb-5 mb-3">
        <div className="flex gap-2 items-center mb-5">
          <h2 className="text-[18px] font-medium text-[#111]">
            Point of Contact for Finalised Applicants
          </h2>
          <div>
            <CustomTooltip
              title="Add the name and number of the person who should get applicant calls on finalisation."
              placement="top"
            >
              <InfoIcon />
            </CustomTooltip>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name of POC */}
          <div className="md:col-span-1">
            <FieldInput
              errorText={errors?.recruiterName}
              className="text-sm font-normal mb-1 block text-[#111]"
              isError={errors?.recruiterName}
              label="Name"
              placeholder="Enter name"
              value={jobDetails?.recruiterName}
              handleChange={(value) =>
                handleFieldUpdate("recruiterName", value)
              }
              inputBg={"#FFF"}
              labelClasses={"font-medium"}
            />
          </div>
          {/* Contact no of POC */}
          <div className="md:col-span-1">
            <div className="flex flex-col gap-[10px] w-full">
              <label className="text-sm font-medium text-[#111]">
                Phone Number
              </label>
              <div className="relative w-full">
                <input
                  value={jobDetails?.recruiterPhoneNumber}
                  onChange={(e) => handleRecruiterPhoneChange(e.target.value)}
                  type="number"
                  placeholder="Enter Number"
                  className={`rounded-lg w-full border-[1px] px-[60px] text-sm  focus:outline-0 h-[40px] text-[#000000] placeholder:text-[14px] placeholder:font-normal placeholder:text-[#d9d9d9] ${
                    errors?.recruiterPhoneNumber
                      ? "border-[#FF4747]"
                      : "border-[#d9d9d9]"
                  } focus:border-[1px] focus:border-[#111]`}
                />
                <div className="absolute top-[6px] left-[12px] flex gap-1 items-center bg-gray-200 py-1 pl-1 pr-2 rounded-md">
                  <span className="text-sm text-[#454545]">+91</span>
                </div>
                {errors?.recruiterPhoneNumber && (
                  <span className="text-xs font-[300] text-[#ED2F2F]">
                    {errors?.recruiterPhoneNumber}
                  </span>
                )}
                <p className="font-normal text-[12px] text-[#5A5A5A] pt-2">
                  This number will be visible only to finalised candidates. All
                  WhatsApp communication for this job will be sent to this
                  number.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PocSection;
