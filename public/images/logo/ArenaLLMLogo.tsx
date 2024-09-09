import * as React from "react";

interface ArenaLLMLogoProps extends React.SVGProps<SVGSVGElement> {
  strokeColor?: string;
}

const ArenaLLMLogo: React.FC<ArenaLLMLogoProps> = ({
  strokeColor = "#000",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={28}
    fill="none"
    {...props}
  >
    <path
      fill={strokeColor}
      d="M23.938 17.322 12.468.817v8.94l5.26 7.565h6.21ZM6.288 17.322l5.245-7.564V.818L.062 17.321h6.226ZM7.431 17.322h9.161l-4.588-6.597-4.573 6.597ZM18.384 18.258 24 26.34v-8.082h-5.616ZM17.241 18.258H6.782l-6.18 8.925h22.842l-6.203-8.925ZM5.639 18.258H0V26.4l5.639-8.143Z"
    />
  </svg>
);
export default ArenaLLMLogo;
