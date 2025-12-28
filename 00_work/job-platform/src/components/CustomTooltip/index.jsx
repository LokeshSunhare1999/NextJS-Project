import { Tooltip } from "@mui/material";

const CustomTooltip = ({
  title,
  children,
  placement = "top",
  width = "250px",
}) => {
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            width,
            bgcolor: "black",
            color: "white",
            textAlign: "center",
            fontSize: "12px",
            lineHeight: "18px",
            fontWeight: "500",
            fontFamily: "Poppins",
            "& .MuiTooltip-arrow": {
              color: "black",
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
