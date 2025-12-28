"use client";
import VerifiedIcon from "@/assets/icons/common/verifiedIcon.svg";
import CrossBox from "@/assets/icons/common/crossBox.svg";
import Svg from "@/components/Svg";
import CustomBanner from "./CustomBanner";
import { useEffect, useState } from "react";

// employer verificationStatus = VERIFIED
export default function VerifiedBanner() {
  const [verifyBannerKey, setVerifyBannerKey] = useState(null);

  const handleHideVerifyBanner = () => {
    setVerifyBannerKey(false);
    localStorage?.setItem("verifyBannerKey", "true");
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !localStorage?.getItem("verifyBannerKey")
    ) {
      setVerifyBannerKey(true);
      setTimeout(() => {
        handleHideVerifyBanner();
      }, 5000);
    }
  }, []);

  if (!verifyBannerKey) return null;
  return (
    <CustomBanner
      heading="Verification successful"
      description="You can now start shortlisting the applications"
      bgcolor="#B5EABB"
      borderColor="#B5EABB"
      headingColor="#092615"
      descriptionColor="#134D29"
      icon={<VerifiedIcon />}
    >
      <div
        className="cursor-pointer hidden md:block"
        onClick={handleHideVerifyBanner}
      >
        <Svg width="44" height="44" viewBox="0 0 44 44" icon={<CrossBox />} />
      </div>
    </CustomBanner>
  );
}
