import RejectIcon from "@/assets/icons/common/rejectIcon.svg";
import { useRouter } from "next/navigation";
import CustomCTA from "@/components/CustomCTA";
import CustomBanner from "./CustomBanner";

// employer verificationStatu = REJECTED
export default function RejectedBanner({}) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/account-verification");
  };
  return (
    <CustomBanner
      heading="Verification Failed"
      description="Please update your business details and try again"
      bgcolor="#FFE9E8"
      borderColor="#EFD1D1"
      headingColor="#33100D"
      descriptionColor="#661F1B"
      icon={<RejectIcon />}
    >
      <CustomCTA
        title="Retry verification"
        fontSize="16px"
        width={"300px"}
        fontWeight="600"
        borderColor="#661F1B"
        backgroundColor="#FFE9E8"
        textColor="#661F1B"
        border="2px solid"
        borderRadius="8px"
        hoverBgColor="#FFE9E8"
        hoverBorderColor="#661F1B"
        hoverTextColor="#661F1B"
        onClickFn={handleClick}
      />
    </CustomBanner>
  );
}
