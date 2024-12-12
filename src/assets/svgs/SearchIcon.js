import React from "react";
import Svg, { Path } from "react-native-svg";

const SearchIcon = ({ width = 23, height = 24, color = "white" }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M10.5417 19C14.7758 19 18.2083 15.4183 18.2083 11C18.2083 6.58172 14.7758 3 10.5417 3C6.30748 3 2.875 6.58172 2.875 11C2.875 15.4183 6.30748 19 10.5417 19Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.1252 21L16.0044 16.7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SearchIcon;