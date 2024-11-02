import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const IconChekboxUnChecked = (props: Props) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x={12}
        y={12}
        width={16}
        height={16}
        rx={1}
        stroke="#49454F"
        strokeWidth={2}
      />
    </svg>
  );
};

export default IconChekboxUnChecked;
