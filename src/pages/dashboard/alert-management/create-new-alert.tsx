import Image from "next/image";  
import { useState, useEffect } from "react";  
import { FormattedMessage, useIntl } from "react-intl";  
import { getAuthTokenOnClient } from "@/lib/utils";  
import useAuthUserAccount from "@/hooks/useAuthUserAccount"; 
import { toast } from "react-toastify"; 
import Router from 'next/router';  
import routes from "@/constants/routes";

const AlertType = () => {  
    const { data: account } = useAuthUserAccount();  
    const roleName = account?.role_name || "";  

    const [domainName, setDomainName] = useState<string>("");  
    const [receivedEmail, setReceivedEmail] = useState<string>("");  
    const [teamsWebhook, setTeamsWebhook] = useState<string>("");  
    const [slackWebhook, setSlackWebhook] = useState<string>("");  
    const [checkboxStates, setCheckboxStates] = useState<boolean[]>(Array(7 * 3).fill(false));  
    const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);  
    const [errors, setErrors] = useState<string[]>(["", "", "", "", ""]);  

    const handleCheckboxChange = (index: number, isChecked: boolean) => {  
        const updatedCheckboxStates = [...checkboxStates];  
        updatedCheckboxStates[index] = isChecked;  
        setCheckboxStates(updatedCheckboxStates);  
    };  

    const validateEmail = (email: string) => {  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
        return emailRegex.test(email);  
    };  

    const validateURL = (url: string) => {  
        if (url.trim() === "") return true; 
        try {  
            new URL(url);  
            return true;  
        } catch {  
            return false;  
        }  
    };  

    const validateDomainName = (domain: string) => {  
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,6}$/;  
        return domainRegex.test(domain);  
    };  

    useEffect(() => {  
        const isDomainNameValid = roleName === 'client_admin' || domainName.trim() !== "";  
        
        const emailCheckboxSelected = checkboxStates.some((state, index) => index % 3 === 0 && state);  
        const slackCheckboxSelected = checkboxStates.some((state, index) => index % 3 === 1 && state);  
        const teamsCheckboxSelected = checkboxStates.some((state, index) => index % 3 === 2 && state);  
    
        const isReceivedEmailValid = !emailCheckboxSelected || receivedEmail.trim() !== "";  
        const isSlackWebhookValid = !slackCheckboxSelected || slackWebhook.trim() !== "";  
        const isTeamsWebhookValid = !teamsCheckboxSelected || teamsWebhook.trim() !== "";  
        
        setIsSaveEnabled(isDomainNameValid && isReceivedEmailValid && isSlackWebhookValid && isTeamsWebhookValid);  
    }, [roleName, domainName, receivedEmail, slackWebhook, teamsWebhook, checkboxStates]);
    
    const handleSubmit = async () => {  
        const alertTypes = [  
            "alert_leaked_credentials",  
            "alert_company_exposed_ports_and_services",  
            "alert_subdomain_analysis",  
            "alert_domain_variations",  
            "alert_email_protection",  
            "alert_stealer_log",  
            "alert_hacker_and_darkweb_mentions",  
        ];  
    
        const newErrors = ["", "", "", "", ""];  
        if (roleName !== "client_admin" && !validateDomainName(domainName)) newErrors[0] = "invalidDomain";  
        if (!validateEmail(receivedEmail) && receivedEmail.trim() !== "") newErrors[2] = "invalidEmail";  
        if (!validateURL(teamsWebhook) && teamsWebhook.trim() !== "") newErrors[3] = "invalidUrl";  
        if (!validateURL(slackWebhook) && slackWebhook.trim() !== "") newErrors[4] = "invalidUrl";  
        setErrors(newErrors);  
    
        if (newErrors.every((error) => error === "")) {  
            let emailAlerts = [];  
            let slackAlerts = [];  
            let teamsAlerts = [];  
    
            for (let i = 0; i < alertTypes.length; i++) {  
                if (receivedEmail.trim() !== "" && checkboxStates[i * 3]) emailAlerts.push(alertTypes[i]);  
                if (slackWebhook.trim() !== "" && checkboxStates[i * 3 + 1]) slackAlerts.push(alertTypes[i]);  
                if (teamsWebhook.trim() !== "" && checkboxStates[i * 3 + 2]) teamsAlerts.push(alertTypes[i]);  
            }  
    
            const requestBody: any = {};  
    
            if (roleName !== "client_admin") {  
                requestBody.domain_name = domainName;  
            }  
    
            requestBody.email_alert_management = emailAlerts || [];  
            if (receivedEmail.trim() !== "") {  
                requestBody.received_email = receivedEmail;  
            }  
    
            requestBody.slack_alert_management = slackAlerts || [];  
            if (slackWebhook.trim() !== "") {  
                requestBody.slack_webhook = slackWebhook;  
            }  
    
            requestBody.teams_alert_management = teamsAlerts || [];  
            if (teamsWebhook.trim() !== "") {  
                requestBody.teams_webhook = teamsWebhook;  
            }  
    
            const tokens = await getAuthTokenOnClient();  
    
            try {  
                const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/alert_management/`;  
                const response = await fetch(apiUrl, {  
                    method: "POST",  
                    headers: {  
                        "Content-Type": "application/json",  
                        Authorization: `Bearer ${tokens.accessToken}`,  
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
                console.error('Failed to create new alert:', error);  
                const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
                toast.error(`Failed to create new alert. ${errorMessage}`);   
            }  
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
    const intl = useIntl();  

    return (  
        <div className="p-4 xl:p-5">  
            <p style={{ color: '#ab00ab' }} className="text-[30px] font-semibold tracking-[-0.2px]">  
                <FormattedMessage id="createNewAlertButton" />  
            </p>  
            <hr className="my-2 border-t border-t-accent" />  
            <label className="inline-block text-sm font-medium md:text-base lg:text-xl">  
                <FormattedMessage id="domainName" />  
            </label>  
            <input  
                type="text"  
                value={domainName}  
                onChange={(e) => setDomainName(e.target.value)}  
                placeholder={roleName === 'client_admin' ? "Client users cannot customize this field" : intl.formatMessage({ id: "writeDomainName" })}  
                className={`h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl ${roleName === 'client_admin' ? 'cursor-not-allowed opacity-50' : ''}`}  
                readOnly={roleName === 'client_admin'}  
            />  
            {roleName !== 'client_admin' && errors[0] && <p style={{ color: 'red' }}><FormattedMessage id={errors[0]} />  </p>}  
            <div className="-mx-4 flex flex-wrap">  
                <div className="w-full px-4 md:w-1/2">  
                    <label className="inline-block text-sm font-medium md:text-base lg:text-xl">  
                        <FormattedMessage id="ownerEmail" />  
                    </label>  
                    <input  
                        type="text"  
                        value={account?.email}  
                        disabled={true} 
                        placeholder={intl.formatMessage({ id: "writeOwnerName" })}  
                        className="h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl"  
                    />  
                    {errors[1] && <p style={{ color: 'red' }}><FormattedMessage id={errors[1]} /></p>}  
                </div>  
                <div className="w-full px-4 md:w-1/2">  
                    <label className="inline-block text-sm font-medium md:text-base lg:text-xl">  
                        <FormattedMessage id="receivedEmail" />  
                    </label>  
                    <input  
                        type="text"  
                        value={receivedEmail}  
                        onChange={(e) => setReceivedEmail(e.target.value)}  
                        placeholder={intl.formatMessage({ id: "writeReceivedEmail" })}  
                        className="h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl"  
                    />  
                    {errors[2] && <p style={{ color: 'red' }}><FormattedMessage id={errors[2]} /></p>}  
                </div>  
            </div>  
            <label className="inline-block text-sm font-medium md:text-base lg:text-xl">  
                <FormattedMessage id="teamsWebhook" />  
            </label>  
            <input  
                type="text"  
                value={teamsWebhook}  
                onChange={(e) => setTeamsWebhook(e.target.value)}  
                placeholder={intl.formatMessage({ id: "writeTeamsWebhook" })}  
                className="h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl"  
            />  
            {errors[3] && <p style={{ color: 'red' }}><FormattedMessage id={errors[3]} /></p>}  
            <label className="inline-block text-sm font-medium md:text-base lg:text-xl">  
                <FormattedMessage id="slackWebhook" />  
            </label>  
            <input  
                type="text"  
                value={slackWebhook}  
                onChange={(e) => setSlackWebhook(e.target.value)}  
                placeholder={intl.formatMessage({ id: "writeSlackWebhook" })}  
                className="h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl"  
            />  
            {errors[4] && <p style={{ color: 'red' }}><FormattedMessage id={errors[4]} /></p>}  
            <div className="mt-5"></div>  
            <div className="rounded-lg pb-[132px] sm:rounded-xl xl:p-6 xl:shadow-[0_0_12px_rgba(0,0,0,0.12)]">  
                <h2 className="text-sm font-semibold sm:text-2xl/[120%]">  
                    <FormattedMessage id="notificationPreferences" />  
                </h2>  
                <h2 className="mt-3 text-sm font-extralight sm:text-sm/[120%]">  
                    <FormattedMessage id="alertTypeSmallTitle" /><span style={{ color: '#720072', }}>Cyfax</span>  
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
                                                <label className="font-bold">Email</label>  
                                            </div>  
                                            <div className="flex flex-col items-center">  
                                                <Image src="/slack-icon.png" width="24" height="24" alt="Slack Icon" />  
                                                <label className="font-bold">Slack</label>  
                                            </div>  
                                            <div className="flex flex-col items-center">  
                                                <Image src="/microsoft-teams-icon.png" width="24" height="24" alt="Teams Icon" />  
                                                <label className="font-bold">Teams</label>  
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
                            style={{ backgroundColor: '#720072' }}  
                            className={`h-12 w-full rounded-lg px-6 text-sm font-semibold text-white duration-300 hover:opacity-90 md:w-auto md:text-base lg:text-base ${isSaveEnabled ? '' : 'cursor-not-allowed opacity-50'}`}  
                            disabled={!isSaveEnabled}  
                            onClick={handleSubmit}  
                        >  
                            <FormattedMessage id="ctaButton" />  
                        </button>  
                    </div>  
                </div>  
            </div>  
        </div>  
    );  
};  

export default AlertType;