"use client";
import { useState, useRef, useEffect, useContext } from "react";
import { handleLogout, truncateText } from "@/utils/helpers";
import ProfilePlaceholder from "@/assets/icons/common/profilePlaceholder.svg";
import PaymentsIcon from "@/assets/icons/common/payments.svg";
import PaymentsInactiveIcon from "@/assets/icons/common/paymentsDisabled.svg";
import DownArrow from "@/assets/icons/common/downArrow.svg";
import LogoutIcon from "@/assets/icons/common/logoutIcon.svg";
import ProfileIcon from "@/assets/icons/common/menuProfile.svg";
import CreditsPill from "../CreditsPill";
import { EmployerContext } from "@/providers/EmployerProvider";
import { LoadingContext } from "@/providers/LoadingProvider";
import Svg from "../Svg";
import HeaderMenu from "./headerMenu";

const Header = ({
  employerName,
  employerPhoneNo,
  isCreditsPurchased,
  router,
  creditBalance,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const { employer } = useContext(EmployerContext);
  const { showLoading } = useContext(LoadingContext);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenu(!openMenu);
  };

  const handleOptionClick = (onClick) => {
    onClick();
    setOpenMenu(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenu(false);
    }
  };
  const handleBuinessClick = () => {
    router.push("/account-verification");
  };
  const handlePaymentReceiptsClick = () => {
    router.push("/payment-receipts");
  };

  useEffect(() => {
    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const menuOptions = [
    {
      icon: employer?.companyLogoUrl ? (
        <img
          src={employer?.companyLogoUrl}
          alt="Company Logo"
          className="h-[32px] w-[32px] rounded-full object-cover"
        />
      ) : (
        <ProfilePlaceholder />
      ),
      text: truncateText(employerName, 20),
      subText: employerPhoneNo,
    },
    {
      icon: <ProfileIcon />,
      text: "Business Details",
      onClick: handleBuinessClick,
    },
    {
      icon: <PaymentsIcon />,
      inactiveIcon: <PaymentsInactiveIcon />,
      text: "Payment Receipts",
      onClick: handlePaymentReceiptsClick,
      Inactive: true,
    },
    {
      icon: <LogoutIcon />,
      text: "Logout",
      onClick: handleLogout,
    },
  ];

  const handleCreditsClick = () => {
    showLoading();
    router.push("/credit-activity");
  };

  return (
    <header
      ref={menuRef}
      onClick={() => setOpenMenu(false)}
      className="fixed left-0 top-0 z-20 flex h-[60px] md:h-[78px] w-full flex-row items-center justify-end bg-white px-4 md:px-10"
    >
      <div className="flex flex-row items-center gap-2">
        <CreditsPill credits={creditBalance} handleClick={handleCreditsClick} />
        <div
          className="flex flex-row items-center gap-2 cursor-pointer"
          onClick={toggleMenu}
        >
          {employer?.companyLogoUrl ? (
            <img
              src={employer?.companyLogoUrl}
              alt="Company Logo"
              className="h-[32px] w-[32px] rounded-full object-cover"
            />
          ) : (
            <ProfilePlaceholder />
          )}

          <>
            {employerName ? (
              <span className="hidden md:block text-[14px] text-[#000000] font-normal ">
                {truncateText(employerName, 20)}
              </span>
            ) : null}
            <DownArrow />
          </>
        </div>
      </div>
      {openMenu ? (
        <HeaderMenu
          menuOptions={menuOptions}
          handleOptionClick={handleOptionClick}
        />
      ) : null}
    </header>
  );
};

export default Header;
