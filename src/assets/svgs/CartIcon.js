import React from "react";
import Svg, { Path } from "react-native-svg";

const CartIcon = ({ width = 24, height = 24, color = "white" }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.18382 4.00369L16.759 4C17.0564 3.99994 17.343 4.11642 17.5615 4.32626C17.7801 4.53609 17.9147 4.82388 17.9385 5.13231L18.9961 18.6695C19.0087 18.8307 18.9907 18.9929 18.9431 19.1468C18.8954 19.3007 18.8191 19.4433 18.7185 19.5665C18.6179 19.6897 18.4949 19.7911 18.3566 19.8648C18.2183 19.9386 18.0674 19.9833 17.9125 19.9963L17.8178 20H6.183C5.86925 20 5.56835 19.8703 5.34649 19.6395C5.12464 19.4087 5 19.0957 5 18.7692L5.00355 18.6745L6.00437 5.13969C6.02731 4.8306 6.16153 4.54191 6.38019 4.3313C6.59885 4.1207 6.88584 4.0037 7.18382 4.00369Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 9V9.645C15 10.75 13.105 11 12 11C10.895 11 9 10.605 9 9.5V9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CartIcon;
