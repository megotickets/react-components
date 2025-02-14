import * as React from "react"
const TurnOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={23}
    height={23}
    fill="none"
    {...props}
  >
    <path
      stroke="#C1C7B8"
      strokeLinecap="round"
      strokeWidth={2}
      d="M6.079 6.079a7.667 7.667 0 1 0 10.842 0M11.5 7.667V3.833"
    />
  </svg>
)
export default TurnOffIcon
