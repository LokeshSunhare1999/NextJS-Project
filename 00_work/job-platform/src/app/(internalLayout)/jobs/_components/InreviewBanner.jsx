import InreviewIcon from "@/assets/icons/common/inreviewIcon.svg";
import CustomBanner from "./CustomBanner";

// employer verificationStatus = PENDING
export default function InreviewBanner({}) {
  return (
    <CustomBanner
      heading="Verification In-review"
      width={"300px"}
      description="We’ll review your details within 24 hours. You can start shortlisting once it’s done."
      bgcolor="#FFEE99"
      borderColor="#F0D964"
      headingColor="#332708"
      descriptionColor="#674E0F"
      icon={<InreviewIcon />}
    />
  );
}
