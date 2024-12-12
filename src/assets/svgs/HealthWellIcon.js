import React from "react";
import Svg, { Path } from "react-native-svg";

const HealthWellIcon = () => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M9 10C9 13.866 12 17 12 17C12 17 15 13.866 15 10C15 6.134 12 3 12 3C12 3 9 6.134 9 10Z"
        stroke="#BBF654"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.33 8C4.115 7.046 2 7 2 7C2 7 2.096 11.381 4.857 14.143C7.618 16.905 12 17 12 17C12 17 16.381 16.904 19.143 14.143C21.905 11.382 22 7 22 7C22 7 19.886 7.046 17.67 8M12.02 17C11.854 18.333 12.66 21 15.514 21C17.509 21 18.507 19 22 21C21.6 19 20.8 17.72 19.633 17M11.979 17C12.146 18.333 11.339 21 8.487 21C6.49 21 5.493 19 2 21C2.4 19 3.2 17.72 4.367 17"
        stroke="#BBF654"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HealthWellIcon;
