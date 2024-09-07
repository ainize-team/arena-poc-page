import * as React from "react";

interface OutlinkProps extends React.SVGProps<SVGSVGElement> {
  strokeColor?: string;
}

const Outlink: React.FC<OutlinkProps> = ({
  strokeColor = "#000",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={21}
    fill="none"
    {...props}
  >
    <g
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <path d="M15.5 11.757v5a1.667 1.667 0 0 1-1.667 1.666H4.667A1.667 1.667 0 0 1 3 16.757V7.59a1.667 1.667 0 0 1 1.667-1.667h5M13 3.423h5v5M8.834 12.59 18 3.423" />
    </g>
  </svg>
);
export default Outlink;
