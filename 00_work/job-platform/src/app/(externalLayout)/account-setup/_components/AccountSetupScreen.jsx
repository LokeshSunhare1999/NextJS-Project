"use client";
import ExternalHeader from "@/components/ExternalHeader";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Svg from "@/components/Svg";
import BannerListBig from "@/assets/icons/common/bannerListBig.svg";
import ThousandCredits from "@/assets/icons/account-setup/thousandCredits.svg";

export default function AccountSetupScreen() {
  const router = useRouter();

  /** No need to prefetch, as the current screen is already a type of loading screen */
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/jobs");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <ExternalHeader />
      <div className="flex my-10 w-full justify-center">
        <div className=" w-[335px] md:w-[720px] flex-col justify-center border border-[#d6dee5] rounded-t-[16px]">
          <div className="flex flex-col gap-4 text-center justify-center p-8">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 100,
                    color: "#2E0194",
                  }}
                  spin
                />
              }
            />
            <p className="text-[24px] leading-[36px] text-[#111] font-semibold">
              Setting up your account...
            </p>
            <p className="text-[14px] leading-[20px] text-[#95A0A9] font-normal">
              We’re taking you to post your first job – let’s get started...
            </p>
          </div>
          <p className="border-t border-[#d6dee5]"></p>
          <div className="p-4 md:p-8 flex flex-col">
            <p className="my-2 text-[18px] leading-[20px] text-[#111111] font-semibold">
              What You’ll Get
            </p>
            <div className="flex gap-5 items-center p-2">
              <div>
                <Svg
                  width="92"
                  height="92"
                  viewBox="0 0 92 92"
                  icon={<BannerListBig />}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[20px] leading-[28px] text-[#4100A4] font-semibold">
                  Unlimited Job Posts
                </p>
                <p className="text-[14px] leading-[20px] text-[#4A5054] font-normal">
                  Hire at your pace with unlimited postings.
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-center p-2">
              <div>
                <Svg
                  width="92"
                  height="92"
                  viewBox="0 0 92 92"
                  icon={<ThousandCredits />}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[20px] leading-[28px] text-[#4100A4] font-semibold">
                  Finalize 50 candidates for free
                </p>
                <p className="text-[14px] leading-[20px] text-[#4A5054] font-normal">
                  Finalize up to 50 candidates at no cost with your free
                  credits.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
