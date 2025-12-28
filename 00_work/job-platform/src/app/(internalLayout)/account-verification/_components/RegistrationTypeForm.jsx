import { COMPANY_TYPE_LIST } from "@/constants";
import FieldDropdown from "../../_components/FieldDropdown";
import FieldInput from "../../_components/FieldInput";

export default function RegistrationTypeForm({
  data,
  setData,
  setErrors,
  errors,
  employerPhoneNo,
  companyType,
}) {
  const handleChange = (e, field) => {
    let validValue = e || "";

    if (e && e.target && e.target.value !== undefined) {
      validValue = e.target.value || "";
    } else {
      validValue = e || "";
    }

    setData((prev) => ({
      ...prev,
      [field]: validValue,
    }));
    setErrors({});
  };

  return (
    <div className="rounded-lg bg-white border border-[#eee] p-3 md:p-5">
      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldDropdown
            isRequired
            label="Company Registration Type"
            options={COMPANY_TYPE_LIST}
            defaultValue={COMPANY_TYPE_LIST[0]}
            value={data?.registrationType || "Select company Registration Type"}
            className={"w-full text-[#000]"}
            isError={errors?.registrationType}
            errorText="Company Registration Type is required"
            handleChange={(e) => handleChange(e, "registrationType")}
            inputBg={"#FFF"}
            disabled={!!companyType}
          />

          <FieldInput
            label="Registered Phone No"
            placeholder="Enter Registered Phone No"
            className="w-full text-[#000]"
            value={`+91 ${employerPhoneNo}`}
            isError={errors?.phoneNumber}
            errorText="Enter Valid Ph. No."
            disabled={employerPhoneNo}
            handleChange={(e) => handleChange(e, "phoneNumber")}
            inputBg={"#FFF"}
            labelClasses={"font-semibold"}
          />
        </div>
      </div>
    </div>
  );
}
