import Visa from "@/assets/icons/payments/visa.svg";
import DinersClub from "@/assets/icons/payments/dinersClub.svg";
import Mastercard from "@/assets/icons/payments/mastercard.svg";
import Discover from "@/assets/icons/payments/discover.svg";
import Paytm from "@/assets/icons/payments/paytm.svg";
import PhonePe from "@/assets/icons/payments/phonepe.svg";
import GPay from "@/assets/icons/payments/gpay.svg";
import Cred from "@/assets/icons/payments/cred.svg";
import UPI from "@/assets/icons/payments/upi.svg";
import Card from "@/assets/icons/payments/card.svg";
import Pending from "@/assets/icons/payments/pending.svg";
import Verified from "@/assets/icons/payments/verified.svg";
import Rejected from "@/assets/icons/payments/rejected.svg";
import BannerList from "@/assets/icons/common/bannerList.svg";
import BannerAI from "@/assets/icons/common/bannerAI.svg";
import ListIcon from "@/assets/icons/payments/listIcon.svg";
import AiIcon from "@/assets/icons/payments/aiIcon.svg";
import CandidateIcon from "@/assets/icons/common/candidate.svg";

export const CARD_PAYMENT = {
  id: "card",
  icon: <Card />,
  title: "Debit/Credit Card",
  description: "Takes 2 minutes",
  options: [
    {
      icon: <Visa />,
      name: "Visa",
    },
    {
      icon: <DinersClub />,
      name: "Diners Club",
    },
    {
      icon: <Mastercard />,
      name: "Mastercard",
    },
    {
      icon: <Discover />,
      name: "Discover",
    },
  ],
};
export const CONTACT_MAIL = "partnerships@saathi.in";

export const UPI_PAYMENT = {
  id: "upi",
  icon: <UPI />,
  title: "UPI",
  description: "Takes seconds",
  options: [
    {
      icon: <Paytm />,
      name: "Paytm",
    },
    {
      icon: <GPay />,
      name: "GPay",
    },
    {
      icon: <PhonePe />,
      name: "PhonePe",
    },
    {
      icon: <Cred />,
      name: "Cred",
    },
  ],
};

export const CONFIRMATION_SCREEN = {
  PENDING: {
    icon: <Pending />,
    desc: "Processing your payment securely",
    footer: `Please wait while we process your transaction. <a href='mailto:${CONTACT_MAIL}'>Email</a> us in case if you need any help.`,
    bgColor: "#FFF3D3",
    borderColor: "#FFE7A8",
  },
  VERIFIED: {
    icon: <Verified />,
    desc: "Your payment was successfully processed",
    footer: "You are being redirected now...",
    bgColor: "#D5F2E1",
    borderColor: "#ABE6C3",
  },
  REJECTED: {
    icon: <Rejected />,
    desc: "Your payment has failed due to an error",
    footer: "",
    bgColor: "#FFDDD9",
    borderColor: "#FFB8B3",
  },
};

export const PAYMENT_STATUS_POLLING_INTERVAL = 5 * 1000;
export const PAYMENT_STATUS_POLLING_TIMEOUT = 300 * 1000;
export const MIN_CREDITS = 100;
export const CREDIT_TO_FINALIZE = 20;

export const SUBSCRIPTION_BENEFITS = [
  {
    title: "Unlimited Job Posts",
    icon: <BannerList />,
  },
  {
    title: "Finalize 50 Candidates for Free",
    icon: <CandidateIcon />,
  },
];

export const CREDITS_BENEFITS = [
  {
    title: "Credits for AI interviews.",
    icon: <BannerList />,
  },
];

export const BANNER_BENEFITS = [
  {
    title: "Unlimited Job Posts",
    icon: <ListIcon />,
  },
  {
    title: "100 AI Interviews Free",
    icon: <AiIcon />,
  },
];

export const BILLING_BENEFITS = ["Unlimited Job Posts", "Priority Support"];
