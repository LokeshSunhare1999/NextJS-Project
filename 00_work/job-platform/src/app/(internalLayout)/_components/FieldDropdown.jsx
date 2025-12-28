import DisplayDropdown from "@/components/DisplayDropdown";
import ErrorField from "./ErrorField";

const FieldDropdown = ({
  label = "Label",
  isRequired = false,
  options,
  defaultValue,
  handleChange,
  isError,
  errorText,
  value,
  showSearch,
  filterOption,
  disabled,
  inputBg,
  ...props
}) => {
  const { className, inputClasses } = props;
  return (
    <div className={`flex flex-col gap-[10px] ${className}`}>
      <div className="flex gap-1">
        <span className={`text-sm font-medium`}>{label}</span>
        {isRequired ? <span className="text-sm text-[#FF3B3B]">*</span> : null}
      </div>

      <div className="w-full">
        <DisplayDropdown
          disabled={disabled}
          showSearch={showSearch}
          filterOption={filterOption}
          height={40}
          defaultValue={defaultValue}
          options={options}
          value={value}
          handleChangeFn={handleChange}
          classes={inputClasses}
          inputBg={inputBg}
        />
        {isError ? <ErrorField errorText={errorText} /> : null}
      </div>
    </div>
  );
};

export default FieldDropdown;
