import React from "react";

interface ErrorIconProps {
  height?: number;
  width?: number;
  color?: string;
  onClick?: () => void;
}

const ErrorIcon: React.FC<ErrorIconProps> = ({
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
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  );
};

export default ErrorIcon; 