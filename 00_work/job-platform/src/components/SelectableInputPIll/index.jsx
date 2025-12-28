import CustomCTA from "../CustomCTA";
import Svg from "../Svg";
import CrossIcon from "@/assets/icons/common/crossIcon.svg";

const SelectableInputPill = ({
  currentValue,
  onChange,
  key,
  header,
  placeholder,
  isMandatory,
  onAdd,
  selectedPills,
  onRemove,
  inputContainerWidth,
  error,
  isInput = true,
}) => {
  return (
    <div className="flex flex-col gap-0">
      <p className="text-sm font-semibold leading-6 text-black font-poppins flex items-center justify-start gap-[5px]">
        {header}
      </p>

      <div
        className={`relative mt-3 flex p-1 gap-1 items-center flex-wrap w-full rounded-md bg-[#FFF] border border-[#d9d9d9] ${
          inputContainerWidth ? inputContainerWidth : "w-full"
        } ${error ? "border border-red-500" : ""}`}
      >
        {selectedPills?.map((pill, index) => (
          <div
            key={`${pill}-${index}`}
            className="flex-shrink-0 flex items-center gap-0.5 px-4 py-2 rounded-xl text-sm font-poppins border transition-all duration-300 cursor-pointer  border-[#e9e9e9]"
          >
            <span className="text-sm font-poppins leading-normal text-[#586276]">
              {pill}
            </span>
            <Svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              icon={<CrossIcon />}
              className="w-4 h-4 cursor-pointer hover:border-[#004ff3] flex-shrink-0"
              onClick={() => onRemove(index)}
            />
          </div>
        ))}
        <div className="flex-1 flex-shrink-0">
          {isInput ? (
            <input
              placeholder={placeholder}
              value={currentValue}
              onChange={(e) => onChange(e.target.value)}
              className={`text-[#585858] focus:border-transparent focus:outline-none font-normal rounded-lg px-5 py-2 text-sm w-full shadow-tiny`}
            />
          ) : (
            <textarea
              placeholder={placeholder}
              value={currentValue}
              onChange={(e) => onChange(e.target.value)}
              className={`text-[#585858] focus:border-transparent focus:outline-none font-normal rounded-lg px-5 py-2 text-sm w-full shadow-tiny`}
            />
          )}
        </div>
        <div className="mx-1 mb-0.5 ">
          <CustomCTA
            height="30px"
            onClickFn={onAdd}
            title={"Save"}
            textColor={"#141482"}
            backgroundColor={"#FFF"}
            border="none"
            disabled={!currentValue?.trim()}
          />
        </div>
      </div>
      {/* absolute right-[3px] top-[3px] */}

      {error && (
        <span className="text-sm font-light leading-normal text-red-500 font-poppins mt-[10px]">
          {error}
        </span>
      )}
    </div>
  );
};

export default SelectableInputPill;
