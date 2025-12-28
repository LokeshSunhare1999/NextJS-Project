import FieldInput from "@/app/(internalLayout)/_components/FieldInput";
import LocationInput from "@/components/LocationInput";
import ErrorField from "@/app/(internalLayout)/_components/ErrorField";
import { jobTypesPills } from "@/constants";
import RadioGroup from "@/components/RadioGroup";

const JobLocationSection = ({
  jobDetails,
  setJobDetails,
  errors,
  setErrors,
  validateField,
  handleFieldUpdate,
}) => {
  const handleAddJobLocation = (newLocation) => {
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      location: newLocation,
    }));
    setErrors((prev) => ({ ...prev, location: "" }));
  };

  const handleRemoveJobLocation = () => {
    setJobDetails({ ...jobDetails, location: {} });
  };

  const handleSetSelectedJobType = (selected) => {
    const currentJobDetails = { ...jobDetails, typeOfJob: selected[0] };
    const typeOfJobError = validateField(
      "typeOfJob",
      selected[0],
      currentJobDetails
    );
    setErrors((prev) => ({
      ...prev,
      typeOfJob: typeOfJobError,
    }));

    setJobDetails(currentJobDetails);
  };

  return (
    <div>
      <div className="bg-white rounded-lg pt-3 px-6 pb-3 mb-3">
        <h2 className="text-[18px] font-medium mb-5 text-[#111]">
          Work Schedule & Location
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job location */}

          <div className="flex flex-col gap-[10px] w-full">
            <label className="text-sm font-medium text-[#111]">
              Job Location <span className="text-red-500">*</span>
            </label>
            <LocationInput
              onLocationSelect={handleAddJobLocation}
              onLocationRemove={handleRemoveJobLocation}
              locationData={jobDetails?.location}
              error={errors?.location}
            />
          </div>
          {/* Work Hours */}
          <div>
            <FieldInput
              isRequired
              errorText={errors?.workHours}
              className="text-sm font-normal mb-1 block text-[#111]"
              isError={errors?.workHours}
              label="Work Hours"
              placeholder="e.g. 9 AM - 5 PM"
              value={jobDetails?.workHours}
              handleChange={(value) => handleFieldUpdate("workHours", value)}
              inputBg={"#FFF"}
              labelClasses={"font-medium"}
            />
          </div>
          {/* Type of job */}
          <div className="flex flex-col my-3 gap-[10px]">
            <label className="text-sm font-medium mb-0.5 block text-[#111]">
              Type of Job <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <RadioGroup
                name={"typeOfJob"}
                type="radio"
                options={jobTypesPills}
                value={jobDetails?.typeOfJob || ""}
                onChange={(value) => handleSetSelectedJobType([value])}
              />
            </div>
            {errors?.typeOfJob ? (
              <ErrorField errorText={errors?.typeOfJob} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobLocationSection;
