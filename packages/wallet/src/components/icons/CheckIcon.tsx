import React from "react";

interface CheckIconProps {
  height?: number;
  width?: number;
  color?: string;
  onClick?: () => void;
}

const CheckIcon: React.FC<CheckIconProps> = ({
  height = 24,
  width = 24,
  color = "currentColor",
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
};

export default CheckIcon; 