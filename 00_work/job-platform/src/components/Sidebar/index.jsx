"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SaathiLogo from "@/assets/icons/common/saathiLogo.svg";
import {
  BOTTOM_MENU,
  MIN_WIDTH_FOR_DESKTOP,
  SIDEBAR_ITEMS,
} from "@/constants/index";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const currentRoute = usePathname();
  const [isMobileView, setIsMobileView] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (window.innerWidth < MIN_WIDTH_FOR_DESKTOP) {
      setIsMobileView(true);
    }
  }, []);

  const tabItem = (item) => {
    return (
      <Link
        key={item?.title}
        href={item?.href}
        target={item?.target || "_self"}
        className={`flex h-[60px] w-[238px] flex-row items-center gap-2  pl-4 border-[1px] rounded-[10px] bg-white ${
          currentRoute?.includes(item?.href)
            ? "border-[#141482]"
            : "border-[#CDD4DF]"
        } ${
          item?.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        <span className="flex-shrink-0">
          {currentRoute?.includes(item?.href) ? item?.iconActive : item?.icon}
        </span>
        <div className="flex flex-row justify-between w-full mr-2 items-center gap-1">
          <span
            className={`text-[16px] font-normal leading-[20px] ${
              currentRoute?.includes(item?.href)
                ? "text-[#3B2B8C]"
                : "text-[#666666]"
            }`}
          >
            {item?.title}
          </span>
          {item?.tag ?? null}
        </div>
      </Link>
    );
  };

  return (
    <nav className="hidden md:block fixed left-0 top-0 z-30 flex h-screen w-[270px] flex-col bg-white">
      <div className="flex h-[78px] w-full items-center justify-center border-b-[1px] border-[#EEEEEE]">
        <Link href="/jobs" className="cursor-pointer">
          <SaathiLogo />
        </Link>
      </div>
      <div
        className="flex flex-1 flex-col"
        style={{ height: "calc(100vh - 78px)" }}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col gap-3 overflow-y-auto mt-5 px-4">
            {SIDEBAR_ITEMS.map((item) => {
              return tabItem(item);
            })}
          </div>
          <div className="flex flex-col px-4 mb-5">
            {BOTTOM_MENU.map((item) => {
              return tabItem(item);
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
