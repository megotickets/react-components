import * as React from "react"
const ArrowBackIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    {...props}
  >
    <circle cx={7} cy={7} r={7} fill="#000" />
    <path
      stroke="#fff"
      strokeLinecap="round"
      d="m8.296 4.148-3.11 2.593 3.11 2.592"
    />
  </svg>
)
export default ArrowBackIcon
