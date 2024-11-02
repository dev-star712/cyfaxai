import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import Link from "next/link";  
import routes from "@/constants/routes";  

const BodyCard = ({
  children,
  heading,
  details,
  buttonText
}: {
  children: ReactNode;
  heading: string;
  details: string;
  buttonText: string; 
}) => {
  return (
    <div className="space-y-5 rounded-3xl border border-[#d6d6d6] p-5 shadow-[0_4px_14px_2px_rgba(0,0,0,0.1)]">
      {children}
      <h3 className="text-start font-mulish font-bold leading-[18px] text-[#000000] md:text-lg lg:text-2xl lg:leading-[18px]"   
        style={{ fontSize: '18px' }}>  
        <FormattedMessage id={heading} />  
      </h3>
      <p className="text-start font-mulish text-[12px] font-normal leading-[15px] text-[#000000] md:text-xs lg:text-base lg:font-medium lg:leading-6">  
        <FormattedMessage id={details} />  
      </p>
      {heading !== 'homeCard3Title' && (  
        <Link href={routes.home}>  
          <p className="mt-3 cursor-pointer text-start font-mulish text-[15px] font-bold leading-[15px] text-[#720072] md:text-xs lg:text-base lg:leading-6">  
            <FormattedMessage id={buttonText} />  
          </p>  
        </Link>  
      )} 
    </div>
  );
};

export default BodyCard;
