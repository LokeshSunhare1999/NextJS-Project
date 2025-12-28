import Svg from "@/components/Svg";

export default function CustomBanner({
  bgcolor = "",
  borderColor = "",
  headingColor = "",
  descriptionColor = "",
  heading = "",
  description = "",
  icon,
  children,
}) {
  return (
    <div className="pt-2">
      <div
        className={`flex flex-col md:flex-row md:justify-between items-center w-full h-auto p-4 md:p-5  border rounded-lg gap-2 md:gap-0`}
        style={{ borderColor: borderColor, background: bgcolor }}
      >
        <div className="flex gap-3">
          {icon && (
            <div>
              <Svg
                width="54"
                height="54"
                viewBox="0 0 54 54"
                icon={icon}
                className={"w-[40px] h-[40px] md:w-[54px] md:h-[54px] "}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <p
              className="text-[16px] md:text-[20px] font-semibold"
              style={{ color: headingColor }}
            >
              {heading}
            </p>
            <p
              className="text-[12px] md:text-[14px] leading-[20px] font-medium"
              style={{ color: descriptionColor }}
            >
              {description}
            </p>
          </div>
        </div>
        <div className="">{children}</div>
      </div>
    </div>
  );
}
