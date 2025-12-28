"use client";
import React from "react";
import CrossIcon from "@/assets/icons/common/crossIcon.svg";
import Svg from "../Svg";

const MultiSelectPill = ({
  title,
  options,
  selectedOptions,
  setSelectedOptions,
  isMultiselect,
  isMandatory,
  onSelect,
  isDisabled,
  showIcon = false,
}) => {
  const handleSelect = (optionKey) => {
    if (isDisabled) return;
    let currentSelectedOptions = selectedOptions || [];
    if (isMultiselect) {
      currentSelectedOptions = currentSelectedOptions.includes(optionKey)
        ? currentSelectedOptions.filter((o) => o !== optionKey)
        : [...currentSelectedOptions, optionKey];
    } else {
      currentSelectedOptions = currentSelectedOptions.includes(optionKey)
        ? []
        : [optionKey];
    }
    setSelectedOptions(currentSelectedOptions);
    if (typeof onSelect === "function") {
      onSelect(currentSelectedOptions);
    }
  };

  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {options?.map((option) => (
        <Pill
          key={option?.key}
          label={option?.value}
          isSelected={selectedOptions?.includes(option?.key)}
          isDisabled={isDisabled}
          onClick={() => handleSelect(option?.key)}
          showIcon={showIcon}
        />
      ))}
    </div>
  );
};

export const Pill = ({ label, isSelected, isDisabled, onClick, showIcon }) => {
  const baseStyle =
    "px-4 py-2 rounded-xl text-sm font-poppins border transition-all duration-300";
  const isDisabledStyle = isDisabled
    ? "cursor-not-allowed text-[#abb0ba] border-[#e9e9e9]"
    : "cursor-pointer text-[#586276] border-[#e9e9e9] hover:border-[#004ff3]";
  const isSelectedStyle = isSelected
    ? "bg-[#d7d8f6] !text-[#000] !border-[#363CD2] font-medium"
    : "";

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`${baseStyle} ${isDisabledStyle} ${isSelectedStyle}`}
    >
      <div className="flex gap-3 items-center">
        {label}
        {showIcon ? (
          isSelected ? (
            <Svg
              className="cursor-pointer"
              width={14}
              height={14}
              icon={<CrossIcon />}
            />
          ) : (
            <Svg
              className="cursor-pointer rotate-45"
              width={14}
              height={14}
              icon={<CrossIcon />}
            />
          )
        ) : null}
      </div>
    </button>
  );
};

export default MultiSelectPill;
