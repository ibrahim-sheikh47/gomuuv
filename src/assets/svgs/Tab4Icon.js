import React from "react";
import Svg, { Path } from "react-native-svg";

const Tab4Icon = ({ width = 25, height = 25, color = "#AAAAAA" }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M17 6.49998C15.4878 6.36451 14 7.24998 12.5 7.24998C11 7.24998 9.51172 6.35936 8 6.49998C5 6.78123 3.5 9.49998 3.5 14C3.5 17.75 6.5 23 8.7125 23C10.925 23 11.1472 21.875 12.5 21.875C13.8528 21.875 14.0745 23 16.2875 23C18.5005 23 21.5 17.75 21.5 14C21.5 9.49998 20.1406 6.78123 17 6.49998Z"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <Path
        d="M15.3302 4.0436C14.53 4.84385 13.5992 5.12561 13.0178 5.22669C13.1463 4.3496 13.5577 3.53663 14.1917 2.91282C15.0351 2.06948 15.9383 1.82909 16.4831 1.76393C16.352 2.626 15.9487 3.42521 15.3302 4.0436Z"
        stroke={color}
      />
    </Svg>
  );
};

export default Tab4Icon;
