import HamburgerIcon from "@/assets/icons/common/hamburgerIcon.svg";
import DisplayDrawer from "../Drawer";
import { useState } from "react";
import { BOTTOM_MENU, SIDEBAR_ITEMS } from "@/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SaathiLogo from "@/assets/icons/common/saathiLogo.svg";
import Svg from "../Svg";

const HeaderLogo = () => {
  return (
    <div className="flex justify-center">
      <Svg width="120" height="28" viewBox="0 0 130 32" icon={<SaathiLogo />} />
    </div>
  );
};

export default function Hamburger() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const currentRoute = usePathname();
  const tabItem = (item) => {
    return (
      <Link
        key={item?.title}
        href={item?.href}
        target={item?.target || "_self"}
        className={`flex w-full h-20 flex-row items-center border-b-[1px] border-[#ECEFF2] px-4 ${
          item?.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        onClick={() => setShowMenu(false)}
      >
        <span className="flex-shrink-0">
          {currentRoute?.includes(item?.href) ? item?.iconActive : item?.icon}
        </span>
        <div className="flex flex-row ml-4 justify-between w-full items-center">
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
    <>
      <nav className="md:hidden fixed left-[16px] top-0 z-30 h-[60px] flex items-center justify-center">
        <div
          className="h-full flex items-center justify-center"
          onClick={() => setShowMenu(true)}
        >
          <HamburgerIcon />
        </div>
      </nav>
      <DisplayDrawer
        widthClass="w-screen"
        open={showMenu}
        onClose={() => setShowMenu(false)}
        headerChildren={<HeaderLogo />}
        backgroundColor="white"
        direction="left"
        childrenClassname="p-0"
      >
        <div className="flex flex-col gap-[120px]">
          <div className="flex flex-col w-full bg-white ">
            {SIDEBAR_ITEMS.map((item) => {
              return tabItem(item);
            })}
          </div>
          <div className="flex flex-col w-full bg-white justify-center text-center px-25">
            {BOTTOM_MENU.map((item) => {
              return tabItem(item);
            })}
          </div>
        </div>
      </DisplayDrawer>
    </>
  );
}
