import { SVGProps } from "react";

const Spinner = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="spinner">
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default Spinner;
