"use client";
import PricingHeaders from "@/app/(externalLayout)/payment/_components/PricingHeaders";
import PricingCards from "@/app/(externalLayout)/payment/_components/PricingCards";
import { useGetCreditsPackages } from "@/apis/queryHooks";
import Svg from "@/components/Svg";
import PricingGradientBig from "@/assets/icons/jobs/pricingGradientBig.svg";
import PricingGradientSmall from "@/assets/icons/jobs/pricingGradientSmall.svg";

export default function BuyScreen() {
  const { data: creditsPackage } = useGetCreditsPackages();
  return (
    <div className="md:ml-[260px] mt-[78px] font-poppins text-[#000] flex flex-col items-center justify-center relative">
      <Svg
        icon={<PricingGradientBig />}
        width="1165"
        height="355"
        viewBox="0 0 1165 355"
        style={{
          fill: "linear-gradient(90deg, #F4F0FF 0%, #AEE1FF 100%)",
        }}
        className="hidden md:block w-full h-auto absolute top-0 left-0"
      />

      <div
        className="absolute  md:hidden h-[400px] z-[1] top-0 left-[-20px]"
        style={{ width: "calc(100vw + 20px)" }}
      >
        <Svg
          icon={<PricingGradientSmall />}
          width="375"
          height="265"
          viewBox="0 0 375 265"
          style={{
            fill: "linear-gradient(90deg, #F4F0FF 0%, #AEE1FF 100%)",
          }}
          className="w-full h-auto"
        />
      </div>

      <div className="max-w-[1100px] bg-transparent relative z-[2] mt-[60px]">
        <PricingHeaders interviewCost={creditsPackage?.interviewCost} />
        <PricingCards pricingPlans={creditsPackage?.creditPackages} />
      </div>
    </div>
  );
}
