import Svg from "@/components/Svg";
import ZeroJobsIcon from "@/assets/icons/jobs/zeroJobsIcon.svg";
import MailBox from "@/assets/icons/common/mailBox.svg";
import PhoneBox from "@/assets/icons/common/callBox.svg";
import CustomCTA from "@/components/CustomCTA";
import { ReloadOutlined } from "@ant-design/icons";
const ZeroJobsComponent = ({
  mail,
  phoneNo,
  setGlobalFilters,
  updateQueryParams,
}) => {
  const searchParams = new URLSearchParams(window.location.search);
  const hasFilters = () => {
    return (
      searchParams.has("jobCategory") ||
      searchParams.has("jobStatus") ||
      searchParams.has("jobLocation") ||
      searchParams.has("brandName")
    );
  };

  return (
    <div className="bg-white mt-10 rounded-[12px] p-3">
      <div className="flex flex-col pt-12 pb-20 items-center justify-center gap-3">
        <Svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          icon={<ZeroJobsIcon />}
        />
        <p className="font-semibold text-center text-[20px] text-[#000000]">
          {hasFilters()
            ? "No Results Found"
            : "You don’t have any Job posts yet."}
        </p>
        <p className="font-medium md:text-start text-center leading-[18px] text-[#777777] opacity-90">
          {hasFilters()
            ? "It seems that no jobs match the filters you've selected. Try adjusting your filters for more options."
            : "Kindly email us your job description or give us a call for assistance with job postings."}
        </p>

        {hasFilters() ? null : (
          <div className="flex gap-2 mt-7 flex-col md:flex-row">
            <div className="flex">
              <MailBox />
              <div className="flex-col mx-4">
                <p className="leading-[16px] font-medium text-[12px] text-[#777777] opacity-90 ">
                  Our Email Address
                </p>
                <p className="leading-[24px] font-normal text-[16px] text-[#141482]">
                  <a href={`mailto:${mail}`}>{mail}</a>
                </p>
              </div>
            </div>
            <div className="border hidden md:block border-[#D9D9D9] mx-10"></div>
            <div className="flex">
              <PhoneBox />
              <div className="flex-col mx-4">
                <p className="leading-[16px] font-medium text-[12px] text-[#777777] opacity-90 ">
                  Our Contact Number
                </p>
                <p className="leading-[24px] font-normal text-[16px] text-[#141482]">
                  {phoneNo}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ZeroJobsComponent;
