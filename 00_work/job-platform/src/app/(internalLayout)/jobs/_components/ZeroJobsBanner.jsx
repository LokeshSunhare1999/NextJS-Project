import MembershipIcon from "@/assets/icons/common/membershipIcon.svg";
import CustomCTA from "@/components/CustomCTA";
import CustomBanner from "./CustomBanner";
import { YEAR_MEMBERSHIP_PRICE } from "@/constants";

export default function ZeroJobsBanner({
  handleCtaClick,
  isSubscriptionActive = true,
  actualPrice = YEAR_MEMBERSHIP_PRICE,
}) {
  if (isSubscriptionActive) {
    return null;
  }
  return (
    <CustomBanner
      heading="Upgrade for Unlimited Job Posts"
      description="0 Free job post left"
      bgcolor="linear-gradient(276.62deg, #C91400 0%, #FF4D21 43.76%)"
      borderColor="#F0D964"
      headingColor="#FFF"
      descriptionColor="#FFF"
      icon={<MembershipIcon />}
    >
      <CustomCTA
        title={`Upgrade for ₹${actualPrice}*`}
        fontSize="16px"
        width={"300px"}
        fontWeight="600"
        backgroundImg="linear-gradient(90.3deg, #FFC01D 0%, #FFD955 49.16%, #FF9A01 100%)"
        textColor="#000000"
        borderRadius="8px"
        border="none"
        hoverTextColor="#000000"
        onClickFn={handleCtaClick}
      />
    </CustomBanner>
  );
}
