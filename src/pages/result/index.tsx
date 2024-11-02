import Image from "next/image";  
import { FormattedMessage } from "react-intl";  
import ResultCard from "@/components/result-card";  
import routes from "@/constants/routes";  
import Header from "@/components/header";  
import Link from "next/link";  
import { ShieldPlus, FerrisWheel, Globe } from "lucide-react";  
import { useSearch } from '@/context/searchContext';
import EmailProtectionResultsAllTable from "./table";  
import { getPublicReportQueryOptions } from "@/cyfax-api-client/queries";
import { useQuery } from "@tanstack/react-query";
import { CredentialItem } from "@/types/api-responses/detail-report";
import { formatDate } from "@/lib/utils";

const Home = () => {  
    const { searchValue } = useSearch();

    const publicReportQuery = useQuery({
        ...getPublicReportQueryOptions({
          domain: searchValue,
        }),
    });
    const data = publicReportQuery.data?.data;
    const credential_items: Array<CredentialItem> = (data?.combolist_result?.employee_credential_leak?.credential_items || [])  
    .filter((item): item is CredentialItem => item.source === "COMBOLIST" || item.source === "TELEGRAM");
    
    const stealerLogsCount = data?.combolist_result?.stealer_logs?.count || 0;
    const stealerLogsForSaleCount =
        data?.combolist_result?.stealer_logs_for_sale?.count || 0;
    const employeeCredentialLeakCount =
        data?.combolist_result?.employee_credential_leak?.count || 0;
    const hackerDarkWebMentionsCount =
        publicReportQuery.data?.data.combolist_result.hacker_dark_web_mentions
        .count || 0;
    const vulnscanResultCount = data?.vulnscan_result.count || 0;
    const mxtoolboxResultCount = data?.mxtoolbox_result.count || 0;

    const isZeroFindings =
        stealerLogsCount <= 0 &&
        stealerLogsForSaleCount <= 0 &&
        employeeCredentialLeakCount <= 0 &&
        hackerDarkWebMentionsCount <= 0 &&
        vulnscanResultCount <= 0 &&
        mxtoolboxResultCount <= 0;
    return (  
        <>  
        <div className="bg-cover bg-center" style={{ backgroundImage: "url('/mainBG.png')" }}>  
            <Header /> 
            <div className="pt-20">
                <div className="text-center text-[30px] font-bold text-white md:text-[44px]">  
                    <FormattedMessage id="resultText" />
                    <span style={{color: "#E400E4"}}>{searchValue}</span>
                </div>  
                {isZeroFindings && (
                <div className="mt-3 flex w-full items-center justify-center">  
                    <div className="w-4/5 text-center font-bold text-[20x] text-white md:w-3/4 md:text-[32px]">  
                        <span style={{color: "#E400E4"}}><FormattedMessage id="zeroFindingsText1" /></span>
                        <FormattedMessage id="zeroFindingsText2" />
                    </div>  
                </div>  
                )}
                <div className="pt-24"></div>
            </div>  
        </div>             
        <div className="mx-auto mt-28 flex flex-col px-5 lg:px-10 xl:w-[1421px] xl:px-0">  
            <div className="my-9 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4 lg:gap-x-8 lg:gap-y-0">  
                <ResultCard heading={data?.severity} details="homeCard1Description">  
                    <div className="flex size-10 items-center justify-center rounded-3xl bg-[#EDDEED] md:size-12">   
                        <Globe className="size-6 text-[#720072] md:size-7 lg:size-8"/>   
                    </div>    
                </ResultCard>  

                <ResultCard heading={formatDate(data?.timestamp)} details="resultPageCardTitle1">  
                    <div className="flex size-10 items-center justify-center rounded-3xl bg-[#EDDEED] md:size-12">   
                        <ShieldPlus className="size-6 text-[#720072] md:size-7 lg:size-8"/>   
                    </div>        
                </ResultCard>  

                <ResultCard heading={stealerLogsCount} details="resultPageCardTitle2">  
                    <div className="flex size-10 items-center justify-center rounded-3xl bg-[#EDDEED] md:size-12">   
                        <FerrisWheel className="size-6 text-[#720072] md:size-7 lg:size-8"/>   
                    </div>  
                </ResultCard>  

                <ResultCard heading={stealerLogsForSaleCount} details="resultPageCardTitle3">  
                    <div className="flex size-10 items-center justify-center rounded-3xl bg-[#EDDEED] md:size-12">   
                        <FerrisWheel className="size-6 text-[#720072] md:size-7 lg:size-8"/>   
                    </div>  
                </ResultCard> 
                <ResultCard heading={employeeCredentialLeakCount} details="resultPageCardTitle4">
                    <div className="flex size-10 items-center justify-center rounded-3xl bg-[#EDDEED] md:size-12"> 
                    <Globe className="size-6 text-[#720072] md:size-7 lg:size-8"/> 
                    </div>    
                </ResultCard>  

                <ResultCard heading={hackerDarkWebMentionsCount} details="resultPageCardTitle5">  
                    <div className="flex size-10 items-center justify-center rounded-3xl bg-[#EDDEED] md:size-12"> 
                    <ShieldPlus className="size-6 text-[#720072] md:size-7 lg:size-8"/> 
                    </div>        
                </ResultCard>  

                <ResultCard heading={vulnscanResultCount} details="resultPageCardTitle6">  
                    <div className="flex size-10 items-center justify-center rounded-3xl bg-[#EDDEED] md:size-12"> 
                    <FerrisWheel className="size-6 text-[#720072] md:size-7 lg:size-8"/> 
                    </div>
                </ResultCard>  

                <ResultCard heading={mxtoolboxResultCount} details="resultPageCardTitle7">  
                    <div className="flex size-10 items-center justify-center rounded-3xl bg-[#EDDEED] md:size-12"> 
                    <FerrisWheel className="size-6 text-[#720072] md:size-7 lg:size-8"/> 
                    </div>
                </ResultCard> 
            </div>
            <div className="mt-20 flex items-center justify-between rounded-full bg-[#720072] px-12 py-3">  
                <div className="flex-1 text-left">  
                    <p className="font-mulish text-sm font-semibold text-white md:text-xl lg:text-[24px] lg:font-bold lg:leading-[40px]">    
                        <FormattedMessage id="breachTime" />  
                    </p>  
                </div>  

                <div className="flex-1 text-center">  
                    <p className="font-mulish text-sm font-semibold text-white md:text-xl lg:text-[24px] lg:font-bold lg:leading-[40px]">  
                        <FormattedMessage id="credentialsData" />  
                    </p>  
                </div>  

                <div className="flex-1 text-right">  
                    <p className="font-mulish text-sm font-semibold text-white md:text-xl lg:text-[24px] lg:font-bold lg:leading-[40px]">  
                        <FormattedMessage id="source" />  
                    </p>  
                </div>
            </div>
            <div className="mt-10">
                <EmailProtectionResultsAllTable data={credential_items}/>
            </div>
            <div className="my-20 rounded-3xl bg-cover  bg-center" style={{ backgroundImage: "url('/mainBG.png')" }}>
                <div className="flex w-full items-center justify-center pt-20">  
                    <div className="w-4/5 text-center text-[15px] font-bold text-white md:w-3/5 md:text-[20px]">  
                        <FormattedMessage id="guidelineText" />
                    </div>  
                </div>
                <div className="flex items-center justify-center pb-16 pt-3">  
                    <Image 
                        src="/sign1.png" 
                        alt="Sign 1" 
                        className="mr-3 mt-8 md:mr-5 md:mt-10" 
                        width={50}  
                        height={50}  
                    />
                    
                    <Link href={routes.prices}>  
                        <button  
                            className="h-10 w-28 rounded-3xl bg-white text-base font-semibold text-[#720072] duration-300 hover:opacity-80 md:h-10 md:w-32 md:text-lg lg:text-lg"  
                        >  
                            <FormattedMessage id="signUpText" />   
                        </button>  
                    </Link>  
                    
                    <Image 
                        src="/sign2.png" 
                        alt="Sign 2" 
                        className="ml-3 mt-8 md:ml-5 md:mt-10" 
                        width={50}  
                        height={50}  
                    /> 
                </div>
                
            </div>
        </div>  
        </>  
    );  
};  

export default Home;