import PendingIcon from "@/assets/icons/common/pendingIcon.svg";
import { useRouter } from "next/navigation";
import CustomCTA from "@/components/CustomCTA";
import CustomBanner from "./CustomBanner";

// employer verificationStatus = NOT_INITIATED
export default function PendingBanner({}) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/account-verification");
  };
  return (
    <CustomBanner
      heading="Complete Verification"
      description="Verify your business to start shortlisting candidates"
      bgcolor="#FFEE99"
      borderColor="#F0D964"
      headingColor="#332708"
      descriptionColor="#674E0F"
      icon={<PendingIcon />}
    >
      <CustomCTA
        title="Proceed to verification"
        fontSize="16px"
        width={"300px"}
        fontWeight="600"
        borderColor="#674E0F"
        backgroundColor="#FFEE99"
        textColor="#674E0F"
        border="2px solid"
        borderRadius="8px"
        hoverBgColor="#FFEE99"
        hoverBorderColor="#674E0F"
        hoverTextColor="#674E0F"
        onClickFn={handleClick}
      />
    </CustomBanner>
  );
}
