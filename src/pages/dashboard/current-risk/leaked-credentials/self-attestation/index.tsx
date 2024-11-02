import { FormattedMessage, useIntl } from "react-intl";  
import React from 'react';  
import useAuthUserAccount from "@/hooks/useAuthUserAccount";  
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";  

const SelfAttestation = () => {  
    const { data } = useAuthUserAccount(); 
    const { domain } = useDetailReport(); 
    const intl = useIntl(); 

    const formatDate = (isoString: string | undefined) => {  
        if(!isoString) return '';  
        const date = new Date(isoString);  
        return date.toLocaleDateString();  
    }  

    return (  
        <>  
        <div className="p-4 font-mulish xl:p-5">  
            <h2 className="text-[12px] font-bold sm:text-[20px]">  
                <FormattedMessage id="attestationFormTitle1" />   
            </h2>  
            <h2 className="pt-1 text-[11px] font-bold sm:pt-2 sm:text-[18px]">  
                <div className="mb-1 sm:mb-0 sm:inline-block">  
                    <FormattedMessage id="organization" />  
                    <span className="sm:mr-10">{domain}</span>  
                </div>  
                <div className="sm:inline-block">  
                    <FormattedMessage id="date" />: {formatDate(data?.last_login)}  
                </div>  
            </h2>  
            <h2 className="pt-1 text-[12px] font-bold sm:pt-2 sm:text-[20px]">  
                <FormattedMessage id="attestationFormTitle2" />   
            </h2>  
            <p className="pt-1 text-[10px] sm:pt-3 sm:text-[16px]">  
                <FormattedMessage id="attestation1" />   
            </p>  
            <p className="pt-1 text-[11px] sm:pt-2 sm:text-[18px]">  
                <span className="font-bold">  
                    <FormattedMessage id="attestationText1" />  
                </span>  
                <span className="text-[10px] sm:text-[16px]">  
                    <FormattedMessage id="attestationTitleText1" />  
                </span>  
            </p>
            <p className="pt-1 text-[11px] sm:pt-2 sm:text-[18px]">  
                <span className="font-bold">  
                    <FormattedMessage id="attestationText2" />  
                </span>  
                <span className="text-[10px] sm:text-[18px]">  
                    <FormattedMessage id="attestationTitleText2" />  
                </span>  
            </p>
            <p className="pt-1 text-[11px] sm:pt-2 sm:text-[20px]">  
                <span className="font-bold">  
                    <FormattedMessage id="attestationText3" />  
                </span>  
                <span className="text-[10px] sm:text-[16px]">  
                    <FormattedMessage id="attestationTitleText3" />  
                </span>  
            </p>
            <h2 className="pt-1 text-[12px] font-bold sm:pt-2 sm:text-[20px]">  
                <FormattedMessage id="attestationFormTitle3" />   
            </h2>  
            <p className="pt-1 text-[10px] sm:pt-2 sm:text-[16px]">  
                <FormattedMessage id="attestation2" />   
            </p>  
            <p className="pt-1 text-[10px] sm:pt-2 sm:text-[16px]">  
                <FormattedMessage id="attestation3" />   
            </p>  
            <h2 className="pt-1 text-[12px] font-bold sm:pt-2 sm:text-[20px]">  
                <FormattedMessage id="electronicSignature" />   
            </h2> 
            <h2 className="pt-1 text-[12px] font-bold sm:pt-2 sm:text-[20px]">  
                <FormattedMessage id="name" />   
                <input  
                    id="name"  
                    type="text"  
                    className="mb-2 mt-1 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                    placeholder={intl.formatMessage({ id: "namePlaceholder" })}
                />  
            </h2> 
            <h2 className="pt-1 text-[12px] font-bold sm:pt-2 sm:text-[20px]">  
                <FormattedMessage id="title" />   
                <input  
                    id="title"  
                    type="text"  
                    className="mb-2 mt-1 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                    placeholder={intl.formatMessage({ id: "titlePlaceholder" })}
                />  
            </h2> 
            <h2 className="pt-1 text-[12px] font-bold sm:pt-2 sm:text-[20px]">  
                <FormattedMessage id="dateSigned" />{formatDate(data?.created_at)}
            </h2> 
            <label className="flex min-w-[120px] cursor-pointer items-center space-x-2 pt-1 sm:pt-2">  
                <input type="checkbox" name="contactCheckbox" className="size-3 md:size-5" />  
                <span className="text-[10px] sm:text-[16px]">  
                    <FormattedMessage id="assestationAgree" />  
                </span>  
            </label>  
            <div className="pt-2 sm:pt-4">
                <button  
                className="h-9 sm:h-11 rounded-md bg-[#720072] px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                >  
                <FormattedMessage id="submit" />  
                </button>  
            </div>
            
        </div>    
        </>  
    );  
};  

export default SelfAttestation;