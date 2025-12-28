import { JOBS_SORT_OPTIONS } from "@/constants";
import { CheckOutlined } from "@ant-design/icons";
import { useState } from "react";

const SortBottomSheetMweb = ({
  activeSortKey,
  setActiveSortKey,
  selectedFilters,
  handleCloseSortByBottomSheet,
  updateQueryParams,
}) => {
  return (
    <div className="bg-white flex flex-col h-[40vh] px-4 py-4">
      <h2 className="font-bold text-xl border-b text-black border-[#efefef] pb-4">
        Sort By
      </h2>

      <div className="pt-4">
        {JOBS_SORT_OPTIONS?.map((option) => (
          <div
            className={`flex px-2 items-center border-b border-[#F4F6FA] py-2.5 gap-2 text-sm text-[#333] font-medium ${
              activeSortKey === option.value ? "bg-[#F4F6FA] rounded-lg" : ""
            }`}
            onClick={() => {
              setActiveSortKey(option.value);
              updateQueryParams({
                ...selectedFilters,
                sortBy: option.value,
              });
              handleCloseSortByBottomSheet();
            }}
            key={option?.value}
          >
            {option?.label}
            <span className="ml-auto">
              {activeSortKey === option.value && <CheckOutlined />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortBottomSheetMweb;
