const Svg = ({ className, icon, width = 16, height = 16, viewBox = '0 0 16 16', ...props }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {icon}
    </svg>
  );
};

export default Svg;
