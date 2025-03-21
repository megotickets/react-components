import * as React from "react"

const CrossIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="m4.667 4.667 4.615 4.615M9.282 4.667 4.667 9.282"
    />
  </svg>
)
export default CrossIcon