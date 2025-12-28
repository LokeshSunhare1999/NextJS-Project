import FieldInput from "@/app/(internalLayout)/_components/FieldInput";
import RadioGroup from "@/components/RadioGroup";
import CheckboxGroup from "@/components/CheckboxGroup";
import {
  BENEFITS,
  REQUIREMENTS,
  SALARY_OPTIONS,
  SALARY_TYPES,
} from "@/constants";
import MultiSelectPill from "@/components/MultiSelectPill";
import Svg from "@/components/Svg";
import { useState } from "react";
import CrossBox from "@/assets/icons/jobs/crossButtonBlue.svg";
import SelectableInputPill from "@/components/SelectableInputPIll";
import InfoIcon from "@/assets/icons/jobs/infoIcon.svg";
import { Tooltip } from "@mui/material";
import CustomTooltip from "@/components/CustomTooltip";

const CompensationDetailsSection = ({
  jobDetails,
  setJobDetails,
  errors,
  setErrors,
  currentBenefit,
  setCurrentBenefit,
  handleAddBenefit,
  handleRemoveBenefit,
  requirement,
  setRequirement,
  handleAddRequirement,
  handleRemoveRequirement,
  handleFieldUpdate,
}) => {
  const [addAdditionalBenifits, setAddAdditionalBenifits] = useState(false);
  const [addAdditionalRequirements, setAddAdditionalRequirements] =
    useState(false);

  const handleSelection = (val) => {
    setJobDetails((prev) => ({
      ...prev,
      isFixedSalary: val === "fixed",
    }));
    setErrors((prev) => ({
      ...prev,
      minSalary: "",
      maxSalary: "",
    }));
    setJobDetails((prev) => ({
      ...prev,
      minSalary: "",
      maxSalary: "",
    }));
  };

  const handleBenefitsSelect = (values) => {
    handleFieldUpdate("benefits", values);
  };
  const handleRequirementsSelect = (values) => {
    handleFieldUpdate("requirements", values);
  };
  const allBenefitOptions = [
    ...BENEFITS,
    ...jobDetails.benefits
      .filter((b) => !BENEFITS.find((o) => o.value === b))
      .map((b) => ({ key: b, value: b })),
  ];

  const allRequirementOptions = [
    ...REQUIREMENTS,
    ...jobDetails.requirements
      .filter((b) => !REQUIREMENTS.find((o) => o.value === b))
      .map((b) => ({ key: b, value: b })),
  ];

  return (
    <div>
      <div className="bg-white rounded-lg pt-3 px-6 pb-3 my-3">
        <h2 className="text-[18px] font-medium mb-5 text-[#111]">
          Compensation & Perks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary range */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-[10px] block text-[#111]">
              Salary <span className="text-red-500">*</span>
            </label>

            <RadioGroup
              name="salaryType"
              type="radio"
              options={SALARY_OPTIONS}
              value="range"
              onChange={handleSelection}
            />
            <div className="p-1 mt-[10px] rounded-lg space-y-4">
              <div className="flex flex-col flex-1 md:flex-row gap-4">
                <FieldInput
                  placeholder={
                    jobDetails?.isFixedSalary ? "Salary" : "Minimum Salary"
                  }
                  label=""
                  value={jobDetails?.minSalary}
                  handleChange={(value) =>
                    handleFieldUpdate("minSalary", value)
                  }
                  isError={errors?.minSalary}
                  errorText={errors?.minSalary}
                  filled="left"
                  filledColor="#E9EFF4"
                  inputProps={{
                    icon: "₹",
                  }}
                  className={
                    jobDetails?.isFixedSalary ? "w-full md:w-1/2" : "w-full"
                  }
                  inputBg={"#FFF"}
                  labelClasses={"font-medium"}
                />

                {!jobDetails?.isFixedSalary && (
                  <FieldInput
                    label=""
                    placeholder="Maximum Salary"
                    value={jobDetails?.maxSalary}
                    handleChange={(value) =>
                      handleFieldUpdate("maxSalary", value)
                    }
                    isError={errors?.maxSalary}
                    errorText={errors?.maxSalary}
                    filled="left"
                    filledColor="#E9EFF4"
                    inputProps={{
                      icon: "₹",
                    }}
                    type="number"
                    inputBg={"#FFF"}
                    className="w-full"
                    labelClasses={"font-medium"}
                  />
                )}
              </div>

              <CheckboxGroup
                name="salaryType"
                type="checkbox"
                options={SALARY_TYPES}
                values={jobDetails?.salaryType}
                onChange={(selectedValues) => {
                  setJobDetails((prev) => ({
                    ...prev,
                    salaryType: selectedValues,
                  }));
                }}
              />
            </div>
          </div>
          {/* Benefits */}
          <div className="md:col-span-1">
            <div className="text-sm font-medium mb-2 block text-[#111] flex gap-1 items-center">
              Benefits{" "}
              <CustomTooltip
                title="Perks and allowances offered in addition to salary to attract candidates."
                placement="top"
              >
                <InfoIcon />
              </CustomTooltip>
              <p className="text-[10px] leading-[11px] text-[#B7B7B7] font-medium italic">
                (Optional)
              </p>
            </div>
            <MultiSelectPill
              isMultiselect
              title="Benefits"
              options={allBenefitOptions}
              selectedOptions={jobDetails?.benefits || []}
              setSelectedOptions={handleBenefitsSelect}
              showIcon={true}
            />

            {addAdditionalBenifits ? (
              <>
                <SelectableInputPill
                  header=""
                  placeholder="Add Benefits"
                  currentValue={currentBenefit}
                  inputContainerWidth="calc(50% - 8px)"
                  error={errors?.benefits}
                  onChange={(value) => setCurrentBenefit(value)}
                  onAdd={() => handleAddBenefit()}
                  onRemove={(index) => {
                    handleRemoveBenefit(index);
                  }}
                />
                <p className="text-xs italic text-gray-500 mt-2">
                  For multiple benefits, add comma separated values.
                </p>
              </>
            ) : (
              <div
                className="flex text-[12px] gap-1 text-[#363CD2] font-semibold my-3 items-center cursor-pointer"
                onClick={() => setAddAdditionalBenifits(true)}
              >
                <Svg className="cursor-pointer" icon={<CrossBox />} />
                <p>Add Additional</p>
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className="md:col-span-1">
            <div className="text-sm font-medium mb-2 block text-[#111] flex gap-1 items-center">
              Additional Requirements{" "}
              <CustomTooltip
                title="Specific documents, skills, or assets a candidate must have for this role."
                placement="top"
              >
                <InfoIcon />
              </CustomTooltip>
              <p className="text-[10px] leading-[11px] text-[#B7B7B7] font-medium italic">
                (Optional)
              </p>
            </div>
            <MultiSelectPill
              isMultiselect
              title="Requirements"
              options={allRequirementOptions}
              selectedOptions={jobDetails?.requirements || []}
              setSelectedOptions={handleRequirementsSelect}
              showIcon={true}
            />

            {addAdditionalRequirements ? (
              <>
                <SelectableInputPill
                  header=""
                  placeholder="Add Requirements"
                  currentValue={requirement}
                  inputContainerWidth="calc(50% - 8px)"
                  error={errors?.requirements}
                  onChange={(value) => setRequirement(value)}
                  onAdd={() => handleAddRequirement()}
                  onRemove={(index) => {
                    handleRemoveRequirement(index);
                  }}
                />
                <p className="text-xs italic text-gray-500 mt-2">
                  For multiple requirements, add comma separated values.
                </p>
              </>
            ) : (
              <div
                className="flex text-[12px] gap-1 text-[#363CD2] font-semibold my-3 items-center cursor-pointer"
                onClick={() => setAddAdditionalRequirements(true)}
              >
                <Svg className="cursor-pointer" icon={<CrossBox />} />
                <p>Add Additional</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompensationDetailsSection;
