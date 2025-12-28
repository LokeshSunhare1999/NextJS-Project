"use client";

import { Drawer } from "@mui/material";
import CrossIcon from "@/assets/icons/common/crossIcon.svg";
import Svg from "../Svg";
export default function DisplayDrawer({
  open,
  onClose,
  widthClass = "w-[390px]",
  title = "Display Drawer",
  children,
  direction = "right",
  backgroundColor = "#f4f6fa",
  childrenClassname = "p-5",
  headerChildren = null,
}) {
  return (
    <Drawer
      slotProps={{
        paper: {
          sx: {
            backgroundColor: backgroundColor,
          },
        },
      }}
      disableEnforceFocus
      anchor={direction}
      open={open}
      onClose={onClose}
    >
      <div className={`${widthClass}`}>
        <div className="flex justify-between items-center p-5">
          <span className="text-2xl font-semibold">
            {headerChildren ? headerChildren : title}
          </span>
          <Svg
            className="cursor-pointer"
            width={22}
            height={22}
            icon={<CrossIcon />}
            onClick={onClose}
          />
        </div>
        <div className="h-[1px] bg-[#CDD4DF]"></div>
        <div className={childrenClassname}>{children}</div>
      </div>
    </Drawer>
  );
}
