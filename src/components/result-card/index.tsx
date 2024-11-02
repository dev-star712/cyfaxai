import { ReactNode } from "react";  
import { FormattedMessage } from "react-intl";  

const ResultCard = ({  
  children,  
  heading,  
  details  
}: {  
  children: ReactNode;  
  heading: string | number | undefined;  
  details: string;  
}) => {  

  const capitalizeWords = (str: string | number | undefined) => {  
    if (typeof str === 'string') {  
      return str.replace(/\b\w/g, char => char.toUpperCase());  
    }  
    return str;  
  };  

  const headingText = details === 'homeCard1Description'   
    ? capitalizeWords(`${heading} Threat Level`)  
    : heading;  

  return (  
    <div  
        className="mb-0 h-[190px] rounded-3xl border border-[#d6d6d6] p-5 md:mb-10 md:space-y-5 md:p-6"  
        style={{ backgroundImage: "url('/resultCardImage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}  
    >   
        {children}  
        <h3 className="mb-2 mt-5 text-start font-mulish text-[16px] font-bold leading-[18px] text-[#E400E4] md:text-lg lg:text-2xl lg:leading-[18px]" >  
            {headingText}  
        </h3>  
        {details !== 'homeCard1Description' && (  
            <div className="text-start text-[12px] font-bold text-white md:text-[18px]">  
                <FormattedMessage id={details} />  
            </div>  
        )}  
    </div>  
  );  
};  

export default ResultCard;