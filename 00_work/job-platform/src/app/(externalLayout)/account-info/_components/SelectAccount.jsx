import React from "react";
import SelectBox from "./SelectBox";
import HomeIcon from "@/assets/icons/account-info/HomeIcon.svg";
import RecruiterIcon from "@/assets/icons/account-info/RecruiterIcon.svg";
import AccountForm from "./AccountForm";
import { triggerEvent } from "@/utils/events";
import { JOB_EVENTS } from "@/constants/eventEnums";

const selectOptions = [
  {
    title: "I am an Employer",
    value: "Employer",
    icon: <HomeIcon />,
  },
  {
    title: "I am a Recruiter",
    value: "Recruiter",
    icon: <RecruiterIcon />,
  },
];

const SelectAccount = ({
  accountData,
  setAccountData,
  errors,
  setErrors,
  userType,
  setUserType,
  handleNavigate,
  updateEmployerStatus,
  employerSubscriptionData,
}) => {
  const handleSelectBoxClick = (value) => {
    setUserType(value);
    triggerEvent(JOB_EVENTS?.EMPLOGIN_EMPTYPE_CLICK, {
      employer_type: value,
    });
  };
  return (
    <div className="w-full max-w-[390px] mx-auto p-4">
      <div className="mb-6">
        <h2 className="mb-3 font-medium text-[#111] mt-15 md:mt-1">
          Who are you?
        </h2>
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4">
          {selectOptions.map((item) => (
            <SelectBox
              key={item.title}
              title={item.title}
              icon={item.icon}
              isSelected={userType === item.value}
              onClick={() => handleSelectBoxClick(item.value)}
              userType={userType}
            />
          ))}
        </div>
      </div>

      {userType ? (
        <AccountForm
          userType={userType}
          accountData={accountData}
          setAccountData={setAccountData}
          errors={errors}
          setErrors={setErrors}
          handleNavigate={handleNavigate}
          updateEmployerStatus={updateEmployerStatus}
          employerSubscriptionData={employerSubscriptionData}
        />
      ) : null}
    </div>
  );
};

export default SelectAccount;
