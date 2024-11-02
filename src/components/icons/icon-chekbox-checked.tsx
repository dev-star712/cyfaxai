import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const IconChekboxChecked = (props: Props) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x={11} y={11} width={18} height={18} rx={2} fill="#93328E" />
      <path
        d="M18 24.4L14 20.4L15.4 19L18 21.6L24.6 15L26 16.4L18 24.4Z"
        fill="white"
      />
    </svg>
  );
};

export default IconChekboxChecked;
