import CustomCTA from "@/components/CustomCTA";
import { useRouter } from "next/navigation";

export default function TableInfoBanner({ maxCandidatesToBeHired = 1 }) {
  const router = useRouter();

  if (maxCandidatesToBeHired > 0) {
    return null;
  }
  return (
    <div className="w-full rounded-[6px] p-2 md:px-3 mb-[10px] relative">
      <div
        className="absolute top-0 left-0 w-full h-full rounded-[6px] rotate-180 z-[0]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255, 212, 212, 0) -8.86%, rgba(255, 214, 212, 0.793269) 81.68%, #FFD4D4 100%)",
        }}
      />
      <div className="relative w-full h-full flex md:items-center gap-[6px] md:gap-0 flex-col-reverse md:flex-row md:justify-between z-[1]">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-[#111111] text-[12px] md:text-[14px]">
          <div className="flex items-start gap-1">
            <div>🚫</div>
            <div className="text-[12px] leading-[20px] flex">
              <div>
                <span className="font-semibold">Can’t Finalise </span>
                <span className="font-normal">
                  - No credits left. Top up to move candidates forward.
                </span>
              </div>
            </div>
          </div>

          <CustomCTA
            title="Add Credits"
            height="25px"
            width={"90px"}
            fontSize="12px"
            fontWeight="500"
            borderRadius="10px"
            borderColor="none"
            onClickFn={() => router.push("/buy-credits")}
            className={"cursor-pointer"}
          />
        </div>
      </div>
    </div>
  );
}
