export default function DocumentStatusPill({ item }) {
  switch (item?.toLowerCase()) {
    case "verified":
    case "ops_verified":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#E9FFEE] text-xs font-medium leading-[18px] tracking-tight text-[#11B535]">
          Verified
        </span>
      );
    case "signed":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#E9FFEE] text-xs font-medium leading-[18px] tracking-tight text-[#11B535]">
          Signed
        </span>
      );

    case "completed":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#E9FFEE] text-xs font-medium leading-[18px] tracking-tight text-[#11B535]">
          Completed
        </span>
      );

    case "passed":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#E9FFEE] text-xs font-medium leading-[18px] tracking-tight text-[#11B535]">
          Passed
        </span>
      );

    case "recommended":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#32B237] text-[10px] font-medium leading-[18px] tracking-tight text-[#ffffff]">
          Recommended
        </span>
      );

    case "rejected":
    case "ops_rejected":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#FFE8E8] text-xs font-medium leading-[18px] tracking-tight text-[#ED2F2F]">
          Rejected
        </span>
      );

    case "failed":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#FFE8E8] text-xs font-medium leading-[18px] tracking-tight text-[#ED2F2F]">
          Failed
        </span>
      );

    case "pending":
    case "under_evaluation":
    case "video_saved":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#FFF0D6] text-xs font-medium leading-[18px] tracking-tight text-[#F39A01]">
          Pending
        </span>
      );

    case "not signed":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#FFF0D6] text-xs font-medium leading-[18px] tracking-tight text-[#F39A01]">
          Not Signed
        </span>
      );

    case "in_progress":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#FFF0D6] text-xs font-medium leading-[18px] tracking-tight text-[#F39A01]">
          In-Progress
        </span>
      );

    case "not_initiated":
    case "not_started":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#D9D9D9] text-xs font-medium leading-[18px] tracking-tight text-black">
          Not Initiated
        </span>
      );

    case "yet_to_start":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#D9D9D9] text-xs font-medium leading-[18px] tracking-tight text-black">
          Yet to Start
        </span>
      );
    case "approved":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#EEFFF2] text-xs font-medium leading-[18px] tracking-tight text-[#11B535]">
          Approved
        </span>
      );
    case "cancelled":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#D7D7D7] text-xs font-medium leading-[18px] tracking-tight text-[#626262]">
          Cancelled
        </span>
      );
    case "in-progress":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#FFF0D6] text-xs font-medium leading-[18px] tracking-tight text-[#F39A01]">
          In-Progress
        </span>
      );
    case "req-pending":
      return (
        <span className="flex h-[24px] w-[120px] items-center justify-center rounded bg-[#FFF9E3] text-xs font-medium leading-[18px] tracking-tight text-[#FFC700]">
          Request Pending
        </span>
      );
    case "published":
      return (
        <span className="flex h-[24px] w-[70px] items-center justify-center rounded-[6px] bg-[#32B237] text-xs font-medium leading-[18px] tracking-tight text-[#ffffff]">
          Active
        </span>
      );

    case "expired":
      return (
        <span className="flex h-[24px] w-[70px] items-center justify-center rounded-[6px] bg-[#B5B5B5] text-xs font-medium leading-[18px] tracking-tight text-[#ffffff]">
          Expired
        </span>
      );

    case "lapsed":
      return (
        <span className="flex h-[24px] w-[70px] items-center justify-center rounded-[6px] bg-[#888888] text-xs font-medium leading-[18px] tracking-tight text-[#ffffff]">
          Lapsed
        </span>
      );

    case "paused":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#FFF0D6] text-xs font-medium leading-[18px] tracking-tight text-[#F39A01]">
          Paused
        </span>
      );
    case "draft":
    case "in-review":
      return (
        <span className="flex h-[24px] w-[87px] items-center justify-center rounded bg-[#9e6c00] text-xs font-medium leading-[18px] tracking-tight text-[#ffffff]">
          In-Review
        </span>
      );
    case "jobreel":
    case "ai recruiter":
      return (
        <div className="flex min-h-[20px] min-w-[60px] max-w-full px-1 items-center justify-center rounded-[6px] bg-[#DCF5FF] text-xs font-medium leading-[18px] tracking-tight text-[#FFF] break-words text-center">
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90.3deg, #8F3AFF 0%, #006AFF 100%)",
            }}
          >
            {item}
          </span>
        </div>
      );
    default:
      return (
        <span className="flex min-h-[20px] min-w-[60px] max-w-full px-1 items-center justify-center rounded-[6px] bg-[#ffddd9] text-xs font-medium leading-[18px] tracking-tight text-[#FF4E42] break-words text-center">
          {item}
        </span>
      );
  }
}
