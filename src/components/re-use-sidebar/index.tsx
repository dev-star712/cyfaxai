import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

const ReUseSideBar = ({
  children,
  text,
  href,
}: {
  children: ReactNode;
  text: string;
  href?: string;
}) => {
  const Comp = href ? "a" : "div";
  return (
    <Comp
      target={href ? "_blank" : undefined}
      href={href}
      className="my-11 flex flex-col justify-center"
    >
      {children}
      <p className="mt-3 text-center font-mulish text-sm font-semibold text-gray-300 lg:text-base">
        <FormattedMessage id={text} />
      </p>
    </Comp>
  );
};

export default ReUseSideBar;