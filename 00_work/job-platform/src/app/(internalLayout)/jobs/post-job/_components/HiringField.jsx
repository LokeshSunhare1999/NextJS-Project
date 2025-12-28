import FieldInput from "@/app/(internalLayout)/_components/FieldInput";
import LogoUpload from "@/app/(internalLayout)/account-verification/_components/LogoUpload";
import { Spin } from "antd";
import React, { useMemo, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

const HiringField = ({ errors, jobDetails, setJobDetails, employerId }) => {
  const [logoUrl, setLogoUrl] = useState("");

  const loadingIcon = useMemo(
    () => (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    ),
    []
  );

  return (
    <div className="bg-white rounded-lg py-4 px-5 mb-5">
      <div className="rounded-lg p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="flex flex-col gap-2">
            <span className="text-[#000] font-medium">Hiring For</span>
            <FieldInput
              errorText={errors?.hiringFor}
              className="text-sm font-normal mb-1 block"
              isError={errors?.hiringFor}
              label=""
              placeholder="Provide name of the company you are posting this job for"
              value={jobDetails?.jobEmployerName}
              handleChange={(value) =>
                setJobDetails((prev) => ({
                  ...prev,
                  jobEmployerName: value,
                }))
              }
              inputBg={"#FFF"}
            />
          </div>
          <LogoUpload
            initialIcon={logoUrl}
            loadingIcon={loadingIcon}
            setImage={setLogoUrl}
            imageUrl={logoUrl}
            maxFileSizeInMB={5}
            onUploadFn={(logo) => {
              setJobDetails((prev) => ({
                ...prev,
                jobEmployerLogo: logo,
              }));
            }}
            employerId={employerId}
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="clientNameRequired"
            name="clientNameRequired"
            value="clientNameRequired"
            className="h-3 w-3 border-[1.6px] border-[#5C5C5C]"
          />
          <label
            htmlFor="clientNameRequired"
            className="text-sm font-normal text-[#000]"
          >
            I don’t want to provide Client name.
          </label>
        </div>
      </div>
    </div>
  );
};

export default HiringField;
