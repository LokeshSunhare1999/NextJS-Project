import CustomCTA from "@/components/CustomCTA";
import { JOB_BAR_STATES } from "@/constants";
import Link from "next/link";

const JobHeaderBar = ({ status, verificationStatus }) => {
  if (!verificationStatus || !JOB_BAR_STATES[verificationStatus]) return null;

  const { bgColor, message, ctaText, showButton, route } =
    JOB_BAR_STATES[verificationStatus];

  return (
    <div
      className="flex justify-between px-[20px] py-[10px] rounded-t-[10px] items-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="font-semibold text-white text-[12px] md:text-[16px] leading-[16px]">
        {message}
      </div>
      {showButton && (
        <Link href={route}>
          <CustomCTA
            title={ctaText}
            backgroundColor="#FFFFFF"
            textColor="#0F0F0F"
            borderColor="#FFFFFF"
            fontSize="16px"
            fontWeight="600"
            borderRadius="10px"
            hoverBgColor="#FFFFFF"
            hoverTextColor="#0F0F0F"
          />
        </Link>
      )}
    </div>
  );
};

export default JobHeaderBar;
