export default function HeaderMenu({ menuOptions, handleOptionClick }) {
  return (
    <div className="absolute flex flex-col right-[40px] top-[60px] z-30 w-[300px] rounded-[20px] my-[10px] bg-white p-[10px] border border-[#D8D8D8] shadow-[0px_4px_20px_rgba(0,0,0,0.1)]">
      {menuOptions?.map((item, index) => {
        const isLastItem = index === menuOptions.length - 1;
        return (
          <div
            key={item.text}
            className="flex py-2 w-full first:cursor-text cursor-pointer flex-row items-center  gap-4 border-b border-[#ECECEC] last:border-b-0 "
            onClick={() => handleOptionClick(item?.onClick)}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {item.inactive ? item.inactiveIcon : item.icon}
            </div>
            <div className="flex flex-col ml-2 justify-center ">
              <span
                className={`${
                  isLastItem
                    ? "text-[16px] text-[#ED2F2F]"
                    : menuOptions.indexOf(item) === 0
                    ? "text-[14px]"
                    : "text-[16px]"
                } font-normal leading-[18px] text-[#000000]`}
              >
                {item.text}
              </span>
              {item?.subText ? (
                <span className="text-[14px] font-normal leading-[18px] text-[#848484] mb-1">
                  {item.subText}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
