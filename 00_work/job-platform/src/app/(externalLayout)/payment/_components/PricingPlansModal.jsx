import Svg from "@/components/Svg";
import PricingGradient from "@/assets/icons/jobs/pricingGradient.svg";
import MoneyBack from "@/assets/icons/account-info/MoneyBack.svg";
import BadgeComponent from "@/components/BadgeComponent";
import PricingHeaders from "./PricingHeaders";
import PricingCards from "./PricingCards";
import { useGetCreditsPackages } from "@/apis/queryHooks";

export default function PricingPlansModal({ handleModalClose = () => {} }) {
  const { data: creditsPackage } = useGetCreditsPackages();
  return (
    <div className="flex flex-col items-center relative">
      <Svg
        icon={<PricingGradient />}
        width="940"
        height="391"
        viewBox="0 0 940 391"
        style={{
          fill: "linear-gradient(90deg, #F4F0FF 0%, #AEE1FF 100%)",
        }}
        className="w-full h-auto absolute top-0 left-0 md:rounded-md"
      />

      <div className="z-10 w-full max-w-5xl p-6">
        <PricingHeaders interviewCost={creditsPackage?.interviewCost} />
        <PricingCards
          pricingPlans={creditsPackage?.creditPackages}
          handleModalClose={handleModalClose}
        />

        <div className="mt-6 flex justify-center">
          <BadgeComponent
            title="Try risk-free for 100 days. Don’t like it? We’ll refund you"
            icon={<MoneyBack />}
            height="24px"
            backgroundColor="bg-gradient-to-r from-green-300 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
