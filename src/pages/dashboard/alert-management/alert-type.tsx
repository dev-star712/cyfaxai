import { FormattedMessage } from "react-intl";  
import Image from "next/image";  
import { useAlertContext } from '@/context/alertContext';   
import { useState, useEffect } from "react";  
import { getAuthTokenOnClient } from "@/lib/utils";
import { toast } from "react-toastify"; 
import Router from 'next/router';  
import routes from "@/constants/routes";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import IconCircleExclamation from "@/components/icons/icon-circle-exclamation";

const AlertType = () => {   
    const { selectedAlert } = useAlertContext();  
    const [receivedEmail, setReceivedEmail] = useState("");  
    const [teamsWebhook, setTeamsWebhook] = useState("");  
    const [slackWebhook, setSlackWebhook] = useState("");  
    const [checkboxStates, setCheckboxStates] = useState<boolean[]>(Array(7 * 3).fill(false));  
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);  
    const [errorMessage, setErrorMessage] = useState("");  

    const validateEmail = (email: string) => {  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
        return emailRegex.test(email);  
    };  

    const validateURL = (url: string) => {  
        try {  
            new URL(url);  
            return true;  
        } catch (_) {  
            return false;  
        }  
    };  

    useEffect(() => {  
        if (selectedAlert) {  
            setReceivedEmail(selectedAlert.received_email || "");  
            setTeamsWebhook(selectedAlert.teams_webhook || "");  
            setSlackWebhook(selectedAlert.slack_webhook || "");  
    
            const alertTypes = [  
                "alert_leaked_credentials",  
                "alert_company_exposed_ports_and_services",  
                "alert_subdomain_analysis",  
                "alert_domain_variations",  
                "alert_email_protection",  
                "alert_stealer_log",  
                "alert_hacker_and_darkweb_mentions",  
            ];  
    
            const updatedCheckboxStates = Array(7 * 3).fill(false);  
    
            selectedAlert.email_alert_management.forEach((alertType) => {  
                const index = alertTypes.indexOf(alertType);  
                if (index !== -1) {  
                    updatedCheckboxStates[index * 3] = true; 
                }  
            });  
    
            selectedAlert.slack_alert_management.forEach((alertType) => {  
                const index = alertTypes.indexOf(alertType);  
                if (index !== -1) {  
                    updatedCheckboxStates[index * 3 + 1] = true;  
                }  
            });  
     
            selectedAlert.teams_alert_management.forEach((alertType) => {  
                const index = alertTypes.indexOf(alertType);  
                if (index !== -1) {  
                    updatedCheckboxStates[index * 3 + 2] = true;
                }  
            });  
    
            setCheckboxStates(updatedCheckboxStates);  
        }  
    }, [selectedAlert]);

    useEffect(() => {  
        let emailIsValid = receivedEmail === "" || validateEmail(receivedEmail);  
        let teamsIsValid = teamsWebhook === "" || validateURL(teamsWebhook);  
        let slackIsValid = slackWebhook === "" || validateURL(slackWebhook);  

        if (!emailIsValid || !teamsIsValid || !slackIsValid) {  
            setErrorMessage("Please enter valid formats. Email must be valid, and webhooks must be valid URLs.");  
        } else {  
            setErrorMessage("");  
        }  

        const isAnyCheckboxChecked = checkboxStates.some(checked => checked);  

        const isReceivedEmailEntered = receivedEmail !== "" && receivedEmail !== "N/A";  
        const isSlackWebhookEntered = slackWebhook !== "" && slackWebhook !== "N/A";  
        const isTeamsWebhookEntered = teamsWebhook !== "" && teamsWebhook !== "N/A";  

        const emailConditions = isReceivedEmailEntered ? (emailIsValid && checkboxStates.slice(0, 7).some(checked => checked)) : true;  
        const slackConditions = isSlackWebhookEntered ? (slackIsValid && checkboxStates.slice(7, 14).some(checked => checked)) : true;  
        const teamsConditions = isTeamsWebhookEntered ? (teamsIsValid && checkboxStates.slice(14, 21).some(checked => checked)) : true;  

        const hasInputChanged =  
            receivedEmail !== (selectedAlert?.received_email || "") ||  
            teamsWebhook !== (selectedAlert?.teams_webhook || "") ||  
            slackWebhook !== (selectedAlert?.slack_webhook || "");  

        setIsSaveEnabled(  
            (emailConditions || slackConditions || teamsConditions) &&  
            (hasInputChanged || isAnyCheckboxChecked)  
        );  
    }, [receivedEmail, teamsWebhook, slackWebhook, checkboxStates, selectedAlert]);  

    const handleCheckboxChange = (index: number, isChecked: boolean) => {  
        const updatedCheckboxStates = [...checkboxStates];  
        updatedCheckboxStates[index] = isChecked;  
        setCheckboxStates(updatedCheckboxStates);  
    };  

    const handleSave = async () => {  
        if (!selectedAlert) return;  
    
        const alertTypes = [  
            "alert_leaked_credentials",  
            "alert_company_exposed_ports_and_services",  
            "alert_subdomain_analysis",  
            "alert_domain_variations",  
            "alert_email_protection",  
            "alert_stealer_log",  
            "alert_hacker_and_darkweb_mentions",  
        ];  
     
        const emailAlertManagement: string[] = [];  
        const slackAlertManagement: string[] = [];  
        const teamsAlertManagement: string[] = [];  
    
        alertTypes.forEach((type, index) => {  
            if (checkboxStates[index * 3]) emailAlertManagement.push(type);  
            if (checkboxStates[index * 3 + 1]) slackAlertManagement.push(type);  
            if (checkboxStates[index * 3 + 2]) teamsAlertManagement.push(type);  
        });  
    
        const requestBody: any = {  
            id: selectedAlert.id,  
            email_alert_management: emailAlertManagement,  
            slack_alert_management: slackAlertManagement,  
            teams_alert_management: teamsAlertManagement,  
        };  
    
        if (receivedEmail) requestBody.received_email = receivedEmail;  
        if (validateURL(slackWebhook)) requestBody.slack_webhook = slackWebhook;  
        if (validateURL(teamsWebhook)) requestBody.teams_webhook = teamsWebhook;  
    
        try {  
            const tokens = await getAuthTokenOnClient();
            const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/alert_management/`
            const response = await fetch(apiUrl, {  
                method: 'PUT',  
                headers: {  
                    'Content-Type': 'application/json',  
                    'Authorization': `Bearer ${tokens.accessToken}`,
                },  
                body: JSON.stringify(requestBody),  
            });  
    
            if (!response.ok) {  
                const errorResponse = await response.json(); 
                throw new Error(errorResponse.data);
            } 
            const data = await response.json();  
            toast.success(data.data);
            Router.push(routes.alertManagement); 
        } catch (error) {  
            console.error('Failed to save alert:', error);  
            const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
            toast.error(`Failed to save alert. ${errorMessage}`);   
        }  
    };

    const array = [  
        "resultPageCardTitle4",   
        "companyExploitableServicesTableTitle",   
        "subDomainExploitableServicesTableTitle",   
        "domainVariation",   
        "emailProtection",   
        "stealerLog",   
        "hackerAndDarkweb"  
    ];  

    return (  
        <div className="p-4 xl:p-5">  
            <div className="flex items-center">  
                <p  
                    style={{ color: '#ab00ab' }}  
                    className="mr-2 text-[30px] font-semibold tracking-[-0.2px]"  
                >  
                    {selectedAlert?.domain_name}  
                </p>  
                <TooltipProvider delayDuration={0}>  
                    <Tooltip>  
                        <TooltipTrigger>  
                            <IconCircleExclamation className="w-5 text-[#292D32] sm:w-6" />  
                        </TooltipTrigger>  
                        <TooltipContent>  
                            <p>  
                            <FormattedMessage id="alertTypeText" />  
                            </p>  
                        </TooltipContent>  
                    </Tooltip>  
                </TooltipProvider>  
            </div>
            <hr className="my-2 border-t border-t-accent" />  
            <div className="-mx-4 flex flex-wrap">  
                <div className="w-full px-4 md:w-1/2">  
                    <label className="inline-block text-sm font-medium md:text-base lg:text-xl">  
                        <FormattedMessage id="ownerEmail" />  
                    </label>  
                    <input  
                        type="text"  
                        value={selectedAlert?.owner_email || 'N/A'}  
                        disabled={true}  
                        placeholder="N/A"  
                        className="h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl"  
                    />  
                </div>  
                <div className="w-full px-4 md:w-1/2">  
                    <label className="inline-block text-sm font-medium md:text-base lg:text-xl">  
                        <FormattedMessage id="receivedEmail" />  
                    </label>  
                    <input  
                        type="text"  
                        value={receivedEmail || ''}  
                        onChange={(e) => setReceivedEmail(e.target.value)}  
                        placeholder=""  
                        className="h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl"  
                    />  
                </div>  
            </div>  
            <label className="inline-block text-sm font-medium md:text-base lg:text-xl">  
                <FormattedMessage id="teamsWebhook" />      
            </label>  
            <input  
                type="text"  
                value={teamsWebhook || ''}  
                onChange={(e) => setTeamsWebhook(e.target.value)}  
                placeholder=""  
                className="h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl"  
            />  
            <label className="inline-block text-sm font-medium md:text-base lg:text-xl">  
                <FormattedMessage id="slackWebhook" />      
            </label>  
            <input  
                type="text"  
                value={slackWebhook || ''}  
                onChange={(e) => setSlackWebhook(e.target.value)}  
                placeholder=""  
                className="h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl"  
            />  
            <div>  
                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}  
            </div>  
            <div className="mt-5"></div>  
            <div className="rounded-lg pb-[132px] sm:rounded-xl xl:p-6 xl:shadow-[0_0_12px_rgba(0,0,0,0.12)]">  
                <h2 className="text-sm font-semibold sm:text-2xl/[120%]">  
                    <FormattedMessage id="notificationPreferences" />  
                </h2>  
                <h2 className="mt-3 text-sm font-extralight sm:text-sm/[120%]">  
                    <FormattedMessage id="alertTypeSmallTitle" /><span style={{color: '#720072', }}>Cyfax</span>  
                </h2>  

                <div className="mt-11 w-full">  
                    <div className="w-full">  
                        <div className="!mt-4 space-y-3 xl:space-y-4">  
                        <div className="w-full">  
                            <div className="flex h-[76px] w-full items-center justify-center px-3">  
                            <div className="grid w-full grid-cols-7 items-center gap-x-6">  
                                <div className="col-span-4 flex w-full items-center font-medium max-md:text-xs"></div>  

                                <div className="col-span-3 grid grid-cols-3 items-center gap-x-6">  
                                <div className="flex flex-col items-center">  
                                    <Image src="/email.svg" width="24" height="24" alt="Email Icon" />  
                                    <label htmlFor="checkbox1" className="font-bold">Email</label>  
                                </div>  
                                <div className="flex flex-col items-center">  
                                    <Image src="/slack-icon.png" width="24" height="24" alt="Slack Icon" />  
                                    <label htmlFor="checkbox2" className="font-bold">Slack</label>  
                                </div>  
                                <div className="flex flex-col items-center">  
                                    <Image src="/microsoft-teams-icon.png" width="24" height="24" alt="Teams Icon" />  
                                    <label htmlFor="checkbox3" className="font-bold">Teams</label>  
                                </div>  
                                </div>  
                            </div>  
                            </div>  
                        </div>  
                        {array.map((item, index) => (  
                            <div className="mt-4 w-full" key={index}>  
                            <div className="flex h-[76px] w-full items-center justify-center rounded-lg border border-[#EAEAEA] px-3">  
                                <div className="grid w-full grid-cols-7 items-center gap-x-6">  
                                <div className="col-span-4 flex w-full items-center font-medium max-md:text-xs">  
                                    <FormattedMessage id={item} />  
                                </div>  

                                <div className="col-span-3 grid grid-cols-3 items-center gap-x-6">  
                                    {[0, 1, 2].map((i) => (  
                                        <input   
                                            key={`checkbox-${index}-${i}`}  
                                            type="checkbox"   
                                            checked={checkboxStates[index * 3 + i] || false}  
                                            onChange={(e) => handleCheckboxChange(index * 3 + i, e.target.checked)}  
                                        />  
                                    ))}  
                                </div>  
                                </div>  
                            </div>  
                            </div>  
                        ))}  
                        </div>  
                    </div>  
                    <div className="mt-7"></div>  
                    <div className="flex justify-end">  
                        <button   
                            style={{backgroundColor: '#720072'}}   
                            className={`h-12 w-full rounded-lg px-6 text-sm font-semibold text-white duration-300 hover:opacity-90 md:w-auto md:text-base lg:text-base ${isSaveEnabled ? '' : 'cursor-not-allowed opacity-50'}`}  
                            disabled={!isSaveEnabled}  
                            onClick={handleSave}  
                        >  
                            <FormattedMessage id="save" />  
                        </button>  
                    </div>  
                </div>  
            </div>  
        </div>  
    );  
};  

export default AlertType;