import routes from "@/constants/routes";  
import Link from "next/link";  
import { FormattedMessage } from "react-intl";
import {CircleCheckBig} from "lucide-react";
import { useSelectedValue } from '@/context/selectedPriceContext';

type PlanType = 'essentials' | 'professional' | 'enterprise';  

const PriceCard = ({
  heading,
  details,
  text1,
  text2,
  text3,
  text4,
  text5,
  text6
}: {
  heading: PlanType;
  details: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
  text6: string;
}) => {
    const cardHeight = heading === 'professional' ? 'h-[550px] md:h-[590px] md:-mt-[40px]' : 'h-[550px]';  
    const { setSelectedPlan } = useSelectedValue(); 
    const values: Record<PlanType, string> = {  
        "essentials": "Essentials", 
        "professional": "Professional",  
        "enterprise": "Enterprise",  
    }  
    
    const priceType = values[heading];  

    return (
        <div  
            className={` mb-0 ${cardHeight} space-y-5 rounded-3xl border border-[#720072] bg-[#09171B] p-5 shadow-[1px_2px_16px_2px_#720072] md:mb-10 md:space-y-1 md:p-6 lg:space-y-3`}  
        >   
            <h3 className="mt-5 text-start font-mulish text-[24px] font-bold leading-[18px] text-[#E400E4] md:text-[18px] lg:text-[26px] lg:leading-[18px]" >  
                <FormattedMessage id={heading || ""} />  
            </h3>  
            <div className="text-start text-[16px] font-bold text-white md:text-[18px] lg:text-[20px]">  
                {details}
            </div>  
            <Link href={routes.contactUs}>  
                <button  
                    className="mt-7 h-10 w-full rounded-3xl bg-white text-base font-bold text-[#720072] duration-300 hover:opacity-80 md:h-10 md:text-[18px]"  
                    onClick={()=>setSelectedPlan(priceType)}
                >  
                    <FormattedMessage id="letsTalk" />   
                </button>  
            </Link> 
            <div className="flex items-center text-start text-[12px] font-bold text-white md:text-[14px]">  
                <CircleCheckBig className="mr-2 text-[#720072]"/>   
                {text1 || ""}
            </div>
            <div className="flex items-center text-start text-[12px] font-bold text-white md:text-[14px]">  
                <CircleCheckBig className="mr-2 text-[#720072]"/>   
                {text2 || ""}
            </div>
            <div className="flex items-center text-start text-[12px] font-bold text-white md:text-[14px]">  
                <CircleCheckBig className="mr-2 text-[#720072]"/>   
                {text3 || ""}
            </div>
            <div className="flex items-center text-start text-[12px] font-bold text-white md:text-[14px]">  
                <CircleCheckBig className="mr-2 text-[#720072]"/>   
                {text4 || ""}
            </div>
            <div className="flex items-center text-start text-[12px] font-bold text-white md:text-[14px]">  
                <CircleCheckBig className="mr-2 text-[#720072]"/>   
                {text5 || ""}
            </div>
            <div className="flex items-center text-start text-[12px] font-bold text-white md:text-[14px]">  
                <CircleCheckBig className="mr-2 text-[#720072]"/>   
                {text6 || ""}
            </div> 
        </div>
    );
};

export default PriceCard;
