import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const IconDanger = (props: Props) => (
  <svg

    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g>
      <path
        d="M12 9V14"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9994 21.41H5.93944C2.46944 21.41 1.01944 18.93 2.69944 15.9L5.81944 10.28L8.75944 5.00003C10.5394 1.79003 13.4594 1.79003 15.2394 5.00003L18.1794 10.29L21.2994 15.91C22.9794 18.94 21.5194 21.42 18.0594 21.42H11.9994V21.41Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9941 17H12.0031"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default IconDanger;
