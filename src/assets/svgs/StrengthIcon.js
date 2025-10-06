import React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";

const StrengthIcon = ({ width = 15, height = 15, color = "#BBF654"}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#clip0_1_314)">
        <Path
          d="M6.67822 11.25C7.13135 9.60938 8.71572 8.4375 10.5407 8.63125C12.2782 8.81563 13.6595 10.2813 13.747 12.025C13.7688 12.4844 13.7063 12.925 13.572 13.3344C13.4907 13.5844 13.247 13.75 12.9813 13.75H3.67447C2.09697 13.75 0.913848 12.3066 1.22322 10.7597L3.1251 1.25H6.8751L8.1251 3.4375L5.44697 5.35313L4.6876 4.375M5.4501 5.35313L6.8751 10.625"
          stroke={color}
          strokeWidth="1.5"
          strokeMiterlimit="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1_314">
          <Rect width="15" height="15" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default StrengthIcon;
