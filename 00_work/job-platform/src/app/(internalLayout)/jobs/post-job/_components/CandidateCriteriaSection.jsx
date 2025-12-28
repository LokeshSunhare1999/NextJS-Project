import FieldInput from "@/app/(internalLayout)/_components/FieldInput";
import ErrorField from "@/app/(internalLayout)/_components/ErrorField";
import {
  ageRequiredOptions,
  genderPreference,
  minQualificationsEnums,
} from "@/constants";
import ExperienceField from "@/components/ExperienceField";
import FieldDropdown from "@/app/(internalLayout)/_components/FieldDropdown";
import RadioGroup from "@/components/RadioGroup";
import RadioCheckboxGroup from "@/components/CheckboxGroup";

const CandidateCriteriaSection = ({
  jobDetails,
  errors,
  handleAgePreferenceClick,
  handleQualificationsSelect,
  handleNoMandatoryExpClick,
  isAgeMinReqSelected,
  handleFieldUpdate,
}) => {
  const handleSetGenderPreference = (values) => {
    handleFieldUpdate("genderPreference", values);
  };

  return (
    <div>
      <div className="bg-white rounded-lg pt-3 px-6 pb-3 mb-3">
        <h2 className="text-[18px] font-medium mb-5 text-[#111]">
          Candidate Criteria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Min. Qualification */}
          <div>
            <FieldDropdown
              label={
                <label className="text-sm font-medium block text-[#111] flex gap-2 items-center">
                  Min. Qualification
                  <p className="text-[10px] leading-[11px] text-[#B7B7B7] font-medium italic">
                    (Optional)
                  </p>
                </label>
              }
              options={minQualificationsEnums}
              value={
                jobDetails?.minQualification || "Select minimum qualification"
              }
              handleChange={(value) => handleQualificationsSelect(value)}
              inputBg={"#FFF"}
              className={"text-[#111]"}
            />
          </div>

          {/* Experience */}
          <div className="flex flex-col gap-[10px] w-full min-w-[60px]">
            <div className="flex gap-1">
              <div className="text-sm font-medium text-[#111]">
                Required Experience
              </div>

              <span className="text-sm text-[#FF3B3B]">*</span>
            </div>

            <div className="flex flex-col flex-1 md:flex-row gap-4">
              <ExperienceField
                isRequired
                isError={errors?.minExp}
                errorText={errors?.minExp}
                placeholder="Minimum experience (year)"
                value={jobDetails?.minExp || ""}
                // disabled={Boolean(jobDetails?.noMandatoryExperience)}
                handleChange={(value) => handleFieldUpdate("minExp", value)}
                inputBg={"#FFF"}
              />

              <ExperienceField
                isError={errors?.maxExp}
                errorText={errors?.maxExp}
                isLabel={false}
                placeholder="Maximum experience (year)"
                value={jobDetails?.maxExp || ""}
                // disabled={Boolean(jobDetails?.noMandatoryExperience)}
                handleChange={(value) => handleFieldUpdate("maxExp", value)}
                inputBg={"#FFF"}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                checked={jobDetails?.noMandatoryExperience}
                type="checkbox"
                onChange={() => handleNoMandatoryExpClick()}
                id="expNotMandatory"
              />
              <label htmlFor="expNotMandatory" className="text-sm text-[#000]">
                Freshers can also apply
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age Preference */}
          <div className="flex flex-col my-3 md:-mt-4">
            <div>
              <label className="text-sm font-medium block mb-[12px] text-[#111] flex gap-2 items-center leading-[20px]">
                Age Preference?
                <p className="text-[10px] leading-[11px] text-[#B7B7B7] font-medium italic">
                  (Optional)
                </p>
              </label>
              <div className="flex gap-2 mt-[10px]">
                <RadioGroup
                  name={"agePreference"}
                  type="radio"
                  options={ageRequiredOptions}
                  value={jobDetails?.agePreference || []}
                  onChange={(value) => handleAgePreferenceClick(value)}
                />
              </div>
            </div>

            {isAgeMinReqSelected ? (
              <div className="md:col-span-1 mt-2">
                <div className="flex gap-2">
                  <FieldInput
                    errorText={errors?.minAge}
                    className="text-sm font-normal mb-1 block text-[#111] w-1/2"
                    isError={errors?.minAge}
                    label=""
                    placeholder="Minimum Age"
                    value={jobDetails?.minAge}
                    handleChange={(value) => handleFieldUpdate("minAge", value)}
                    inputBg={"#FFF"}
                  />
                  <FieldInput
                    errorText={errors?.maxAge}
                    className="text-sm font-normal mb-1 block text-[#111] w-1/2"
                    isError={errors?.maxAge}
                    label=""
                    placeholder="Maximum Age"
                    value={jobDetails?.maxAge}
                    handleChange={(value) => handleFieldUpdate("maxAge", value)}
                    inputBg={"#FFF"}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Gender Preference */}
        <div className="my-1">
          <label className="text-sm font-medium mb-[12px] block text-[#111] leading-[20px]">
            Gender Preference<span className="text-red-500">*</span>
          </label>

          <RadioCheckboxGroup
            name={"genderPreference"}
            type="radio"
            options={genderPreference}
            value={jobDetails?.genderPreference || []}
            onChange={handleSetGenderPreference}
          />
          {errors?.genderPreference && (
            <ErrorField errorText={errors?.genderPreference} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCriteriaSection;
