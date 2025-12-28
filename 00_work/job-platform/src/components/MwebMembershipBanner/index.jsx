import { BANNER_BENEFITS } from "@/constants/payment";
import BannerStar from "@/assets/icons/common/bannerStar.svg";
import Image from "next/image";
export default function MwebMembershipBanner({
  title,
  actualPrice,
  loginPageTexts,
}) {
  return (
    <header className="w-full h-[68px] border-b-[1px] border-[#EEEEEE] md:rounded-t-[16px] flex flex-row items-center justify-between px-3 md:px-5 bgBase relative">
      <div className="absolute inset-0 z-0">
        <Image
          loading="eager"
          src="/assets/mwebMembershipBanner.webp"
          alt="Login Background"
          fill
          priority={true}
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={80}
        />
      </div>

      <div className="absolute z-10 flex flex-row items-center justify-start gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-[18px] md:text-[22px] leading-[28px] font-medium text-[#FFFFFF]">
              {title}
            </span>
            <BannerStar />
          </div>
          <span className="text-[12px] leading-[18px] font-normal text-[#E0DAFC] flex flex-row gap-5">
            {BANNER_BENEFITS?.map((item, idx) => {
              return (
                <div
                  key={item?.title}
                  className="flex flex-row items-center gap-2"
                >
                  {item?.icon}
                  <span>{loginPageTexts?.[idx]}</span>
                </div>
              );
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
