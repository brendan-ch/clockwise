// @ts-nocheck
/* eslint-disable */

import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function AppIcon(props: SvgProps) {
  return (
    <Svg
      width={1024}
      height={1024}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M512 269a243.005 243.005 0 01224.503 150.008 243.002 243.002 0 01-317.495 317.495A243.001 243.001 0 01269 512h35.25a207.75 207.75 0 00354.652 146.902A207.754 207.754 0 00512 304.25V269z"
        fill="#333"
      />
      <Path d="M494 269h15c11.046 0 20 8.954 20 20v81h-35V269z" fill="#333" />
      <Path
        d="M397 526.339L493.703 600 628 426"
        stroke="#333"
        strokeWidth={38}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default AppIcon;
