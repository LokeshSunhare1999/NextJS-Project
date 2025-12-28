export default function SidebarTag({ tag }) {
  return (
    <span className="flex h-4 flex-row items-center rounded-[100px] bg-[#DDDDE8] px-[6px] text-[8px] font-semibold uppercase leading-[12px] text-[#666666]">
      {tag}
    </span>
  );
}
