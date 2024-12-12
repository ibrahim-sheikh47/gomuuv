import React from "react";
import Svg, { Path } from "react-native-svg";

const Tab3Icon = ({ color = "#aaaaaa" }) => {
  return (
    <Svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M12 7.19L17 11.69V19.5H15V13.5H9V19.5H7V11.69L12 7.19ZM12 4.5L2 13.5H5V21.5H11V15.5H13V21.5H19V13.5H22"
        fill={color}
      />
    </Svg>
  );
};

export default Tab3Icon;
