import CustomCTA from "@/components/CustomCTA";
import React from "react";

const BulkMoveFooter = ({
  selectedCandidatesLength = 0,
  handleDeselect = () => {},
  ctaText = "Move to AI Recruiter",
  handleCTAClick = () => {},
  isCTAdisabled = false,
  isSelectAllDisabled = false,
  isSelectAllChecked = false,
  handleSelectAllCards = () => {},
}) => {
  const ctaElement = () => {
    return (
      <CustomCTA
        backgroundColor="#139117"
        borderColor="#32B237"
        borderRadius="8px"
        textColor="#FFFFFF"
        width="100%"
        height="29px"
        hoverBgColor="#32B237"
        hoverTextColor="#ffffff"
        hoverBorderColor="#32B237"
        title={ctaText}
        disabled={isCTAdisabled}
        onClickFn={handleCTAClick}
      />
    );
  };

  if (selectedCandidatesLength === 0) {
    return null;
  }
  return (
    <div className="text-[#000] bg-[#FFF] border-t-1 border-l-1 border-[#EEE] py-4 px-5 flex items-center justify-between z-10 md:flex-row flex-col">
      <div className="text-sm font-medium hidden md:block">
        <span>{selectedCandidatesLength} Candidates Selected </span>
        <span> | </span>
        <span onClick={handleDeselect} className="cursor-pointer underline">
          Deselect
        </span>
      </div>
      <div className="flex justify-between items-center w-full md:hidden">
        <div className="flex gap-3 py-2 px-4 rounded-t-[12px]">
          <input
            id="selectAllCards"
            type="checkbox"
            disabled={isSelectAllDisabled}
            checked={isSelectAllChecked}
            onChange={() => handleSelectAllCards()}
          />
          <label
            htmlFor="selectAllCards"
            className="text-[#747576] font-medium text-xs uppercase cursor-pointer"
          >
            Select All
          </label>
        </div>
        <span className="text-sm font-medium">
          {selectedCandidatesLength} Candidates Selected{" "}
        </span>
      </div>
      <div className="hidden md:block">{ctaElement()}</div>
      <div className="w-full mt-[10px] block md:hidden">{ctaElement()}</div>
    </div>
  );
};

export default BulkMoveFooter;
