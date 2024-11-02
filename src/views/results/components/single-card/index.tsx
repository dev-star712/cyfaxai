import Image from "next/image";
import { FormattedMessage } from "react-intl";

const SingleCard = ({
  date,
  title,
  iconSrc,
}: {
  date: string | number | undefined;
  title: string;
  iconSrc: string;
}) => {
  return (
    <div className="mx-auto flex min-h-40 w-full flex-col rounded-lg border border-[#dec1dd] bg-white p-6 px-2 pt-4 text-center lg:rounded-2xl">
      <Image
        src={iconSrc}
        className="mx-auto size-6 flex-none md:size-8 lg:size-[60px]"
        alt="icon"
        height={200}
        width={200}
      ></Image>
      <div className="flex grow items-center justify-center">
        <h2 className="font-mulish text-xl font-medium leading-[30px] text-black lg:text-[32px] lg:leading-[48px] ">
          {date}
        </h2>
      </div>
      <h3 className="flex-none font-mulish text-base font-medium leading-6 text-black lg:text-2xl lg:leading-[36px]">
        <FormattedMessage id={title} />
      </h3>
    </div>
  );
};

export default SingleCard;
