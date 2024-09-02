import * as React from "react";

interface ArrowUpLightProps extends React.SVGProps<SVGSVGElement> {
  strokeColor?: string;
}

const ArrowUpLight: React.FC<ArrowUpLightProps> = ({
  strokeColor = "#62667D",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    stroke={strokeColor}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 15.833V4.167M4.167 10 10 4.167 15.833 10" />
  </svg>
);

export default ArrowUpLight;
