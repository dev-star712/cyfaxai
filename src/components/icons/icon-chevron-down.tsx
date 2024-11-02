import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const IconChevronDown = (props: Props) => (
  <svg
    
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g>
      <path
        d="M17.9207 8.17999H11.6907H6.08072C5.12072 8.17999 4.64073 9.33999 5.32073 10.02L10.5007 15.2C11.3307 16.03 12.6807 16.03 13.5107 15.2L15.4807 13.23L18.6907 10.02C19.3607 9.33999 18.8807 8.17999 17.9207 8.17999Z"
        fill="currentColor"
      />
    </g>
  </svg>
);

export default IconChevronDown;
