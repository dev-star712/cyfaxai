import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const IconAlert = (props: Props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 20V18H6.6L8.575 11.425C8.70833 10.9917 8.95433 10.646 9.313 10.388C9.67167 10.13 10.0673 10.0007 10.5 10H13.5C13.9333 10 14.3293 10.1293 14.688 10.388C15.0467 10.6467 15.2923 10.9923 15.425 11.425L17.4 18H19V20H5ZM8.7 18H15.3L13.5 12H10.5L8.7 18ZM11 8V3H13V8H11ZM16.95 10.475L15.525 9.05L19.075 5.525L20.475 6.925L16.95 10.475ZM18 15V13H23V15H18ZM7.05 10.475L3.525 6.925L4.925 5.525L8.475 9.05L7.05 10.475ZM1 15V13H6V15H1Z"
      fill="currentColor"
    />
  </svg>
);

export default IconAlert;
