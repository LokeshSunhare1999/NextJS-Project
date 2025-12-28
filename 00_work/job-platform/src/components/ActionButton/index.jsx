import { Popover } from "antd";
import { useState } from "react";
const ActionButton = ({
  arrBtn,
  setActionOpen,
  isLast = false,
  top,
  fontSize,
  right,
  left,
  width,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  if (!arrBtn || arrBtn?.length === 0) return null;

  const handleActionElementClick = (e, item) => {
    e.stopPropagation();
    setOpen(false);
    item.onClick(e);
  };
  const actionElements = arrBtn?.map((item, index) => {
    return (
      <div
        key={index}
        className={`flex w-full  items-center border-b border-[#EBEBEB] px-4 py-2 ${
          item.isVisible
            ? "hover:bg-gray-100 cursor-pointer"
            : "hover:bg-white cursor-not-allowed"
        }`}
        onClick={(e) => {
          item.isVisible && handleActionElementClick(e, item);
        }}
      >
        <span className="mr-2 flex items-center">{item.icon}</span>
        <span
          className={`text-sm ${
            item.isVisible ? "text-[#586276]" : "text-gray-400"
          }`}
        >
          {item.text}
        </span>
      </div>
    );
  });
  return (
    <Popover
      placement="bottom"
      content={actionElements}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

export default ActionButton;
