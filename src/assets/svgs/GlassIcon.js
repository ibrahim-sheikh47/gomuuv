import React from "react";
import Svg, { Path } from "react-native-svg";

const GlassIcon = ({ width = 52, height = 52, stroke = "#BBF654" }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M32.8 47.25H19.2C18.146 47.2558 17.1275 46.8698 16.3422 46.1669C15.5568 45.464 15.0607 44.4944 14.95 43.4463L11.125 6.875H40.875L37.0287 43.4463C36.9185 44.4907 36.4253 45.4574 35.6445 46.1598C34.8636 46.8622 33.8503 47.2506 32.8 47.25Z"
      stroke={stroke}
      strokeWidth="2.61219"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 25.0549H30.1099M26.0549 21V29.1099"
      stroke={stroke}
      strokeWidth="2.61"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default GlassIcon;
