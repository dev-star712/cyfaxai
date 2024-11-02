import Image from "next/image";  
import { FormattedMessage } from "react-intl";  
import PriceCard from "@/components/plan-card";  
import Header from "@/components/header";  
import PlansPricingAllTable from "./table";  
import React, { useState } from 'react';  

const Home = () => {  
    const [selectedPlan, setSelectedPlan] = useState("essentials");  
    const credential_items: Array<{ feature: string; essentials: string; professional: string; enterprise: string }> = [  
        {  
            "feature": "Hyperautomated Pen Tests",  
            "essentials": "5 tests/month",  
            "professional": "15 tests/month",
            "enterprise": "Unlimited"
        },  
        {  
            "feature": "Users",  
            "essentials": "1 user license",  
            "professional": "Up to 3 user licenses",
            "enterprise": "Up to 10 user licenses"
        },  
        {  
            "feature": "VIP monitoring",  
            "essentials": "1 slot",  
            "professional": "3 slots",
            "enterprise": "5 slots"
        },  
        {  
            "feature": "Takedown Services",  
            "essentials": "Available as an add-on",  
            "professional": "2/month (additional available)",
            "enterprise": "Comprehensive included"
        },  
        {  
            "feature": "Priority Alerting",  
            "essentials": "Basic real-time alerting",  
            "professional": "Enhanced with customizable criteria",
            "enterprise": "Fully customizable with priority notifications"
        },  
        {  
            "feature": "Reporting",  
            "essentials": "Basic automated reports",  
            "professional": "Advanced reports",
            "enterprise": "Customized intelligence reports"
        },  
        {  
            "feature": "Domain Coverage",  
            "essentials": "1 primary domain and associated sub-domains",  
            "professional": "3 primary domains and associated sub-domains",
            "enterprise": "Flexible (multiple divisions and subdomains)"
        },  
        {  
            "feature": "IP Address Coverage",  
            "essentials": "10 IP addresses",  
            "professional": "100 IP addresses",
            "enterprise": "Flexible"
        },  
        {  
            "feature": "VIPs Monitored",  
            "essentials": "1 VIP",  
            "professional": "3 VIPS",
            "enterprise": "5 VIPS"
        },  
        {  
            "feature": "Data Sources Covered",  
            "essentials": "Dark Web, Telegram, Blackmarkets",  
            "professional": "Dark Web, Telegram, Blackmarkets, Paste Sites, Discord",
            "enterprise": "Full Data Source Coverage including RaaS sites"
        },  
        {  
            "feature": "Support",  
            "essentials": "Email, support, 8-hour response SLA, 1-hour for critical breaches",  
            "professional": "Email support, 4-hour response SLA, 1-hour for critical breaches",
            "enterprise": "Dedicated Threat Intelligence Expert, 2-hour SLA, up to 2 hours monthly consultation"
        },  
        {  
            "feature": "Managed Intel Services",  
            "essentials": "-",  
            "professional": "-",
            "enterprise": "Available(HUMINT)"
        },  
        {  
            "feature": "Notification Routing",  
            "essentials": "Email",  
            "professional": "Email, MS Teams, Slack",
            "enterprise": "Email, MS Teams, Slack, Custom API integration"
        },  
    ];
    return (  
        <>  
            <div className="bg-cover bg-center pb-10" style={{ backgroundImage: "url('/mainBG.png')" }}>  
                <Header />   
                <div className="pt-20">  
                    <div className="text-center text-[30px] font-bold text-white md:text-[44px]">  
                        <FormattedMessage id="plansAndPricing" />  
                    </div>  
                    <div className="mt-3 flex w-full items-center justify-center">  
                        <div className="w-5/6 text-center text-[30px] font-bold text-[#E400E4] md:w-4/5 md:text-[30px]">  
                            <FormattedMessage id="plansAndPricingText1" />  
                        </div>  
                    </div>  
                    <div className="mt-3 flex w-full items-center justify-center">  
                        <div className="w-4/5 text-center font-bold text-[16x] text-white md:w-4/5 md:text-[24px]">  
                            <FormattedMessage id="plansAndPricingText2" />  
                        </div>  
                    </div>  
                    <div className="pt-24"></div>  
                </div>  

                <div className="mx-8 flex items-center justify-center rounded-full bg-white p-2 md:hidden">  
                    <div className="flex w-full max-w-3xl space-x-2">  
                        <button  
                            className={`h-8 flex-1 rounded-3xl text-[12px] font-bold duration-300 ${selectedPlan === "essentials" ? "bg-[#720072] text-white" : "bg-white text-[#a19e9e]"} hover:opacity-80`}  
                            onClick={() => setSelectedPlan("essentials")}  
                        >  
                            <FormattedMessage id="essentials" />  
                        </button>  
                        <button  
                            className={`h-8 flex-1 rounded-3xl text-[12px] font-bold duration-300 ${selectedPlan === "professional" ? "bg-[#720072] text-white" : "bg-white text-[#a19e9e]"} hover:opacity-80`}  
                            onClick={() => setSelectedPlan("professional")}  
                        >  
                            <FormattedMessage id="professional" />  
                        </button>  
                        <button  
                            className={`h-8 flex-1 rounded-3xl text-[12px] font-bold duration-300 ${selectedPlan === "enterprise" ? "bg-[#720072] text-white" : "bg-white text-[#a19e9e]"} hover:opacity-80`}  
                            onClick={() => setSelectedPlan("enterprise")}  
                        >  
                            <FormattedMessage id="enterprise" />  
                        </button>  
                    </div>  
                </div>  

                <div className="px-8 md:mt-[40px] md:px-28">  
                    <div className="my-9 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-3 lg:gap-x-12 lg:gap-y-0">  
                        <div className={`${selectedPlan === "essentials" ? "block md:block" : "hidden md:block"}`}>  
                            <PriceCard   
                                heading="essentials"   
                                details="$6,745/year"   
                                text1="Hyperautomated Pen Tests: 5 tests/month"  
                                text2="Users: 1 user license"  
                                text3="VIP Monitoring: 1 slot"  
                                text4="Takedown Services: Available as an add-on"  
                                text5="Alerting: Basic real-time for critical threats"  
                                text6="Reporting: Basic automated reports"  
                            />  
                        </div>  
                        <div className={`${selectedPlan === "professional" ? "block md:block" : "hidden md:block"}`}>  
                            <PriceCard   
                                heading="professional"   
                                details="$12,745/year"  
                                text1="Hyperautomated Pen Tests: 15 tests/month"  
                                text2="Users: Up to 3 user licenses"  
                                text3="VIP Monitoring: 3 slots"  
                                text4="Takedown Services: 2/month (additional available)"  
                                text5="Alerting: Enhanced with customizable"  
                                text6="Reporting: Advanced reporting capability"  
                            />  
                        </div>  
                        
                        <div className={`${selectedPlan === "enterprise" ? "block md:block" : "hidden md:block"}`}>  
                            <PriceCard   
                                heading="enterprise"   
                                details="Starting $20,000/year"  
                                text1="Hyperautomated Pen Tests: Unlimited"  
                                text2="Users: Up to 10 user licenses"  
                                text3="VIP Monitoring: 5 slots"  
                                text4="Takedown Services: Comprehensive included"  
                                text5="Alerting: Fully customizable with priority notifications"  
                                text6="Reporting: Customized intelligence"  
                            />  
                        </div>  
                    </div>  

                    <div className="mb-0 flex h-[700px] flex-col overflow-hidden rounded-3xl border border-none border-[#d6d6d6] md:mb-10 md:h-[330px] md:flex-row"  
                        style={{ backgroundColor: "rgb(2, 7, 18)" }}>  
                        <div className="w-full rounded-3xl p-4 md:w-4/5 md:rounded-r-none md:p-8">   
                            <h3 className="my-2 text-start font-mulish text-[24px] font-bold leading-[28px] text-[#E400E4] md:text-[28px]">  
                                <FormattedMessage id="addOns" />  
                            </h3>  
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">  
                                <div className="text-start text-[15px] font-bold leading-[24px] text-white md:text-[16px]">  
                                    <FormattedMessage id="addOns1" />  
                                </div>  
                                <div className="text-start text-[15px] font-bold leading-[24px] text-white md:text-[16px]">  
                                    <FormattedMessage id="addOns2" />  
                                </div>  
                                <div className="text-start text-[15px] font-bold leading-[24px] text-white md:text-[16px]">  
                                    <FormattedMessage id="addOns3" />  
                                </div>  
                                <div className="text-start text-[15px] font-bold leading-[24px] text-white md:text-[16px]">  
                                    <FormattedMessage id="addOns4" />  
                                </div>  
                            </div>  
                            <h3 className="mb-2 mt-5 text-start font-mulish text-[24px] font-bold leading-[28px] text-[#E400E4] md:text-[28px]">  
                                <FormattedMessage id="cost" />  
                            </h3>  
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">  
                                <div className="text-start text-[15px] font-bold leading-[24px] text-white md:text-[16px]">  
                                    <FormattedMessage id="costText1" />  
                                </div>  
                                <div className="text-start text-[15px] font-bold leading-[24px] text-white md:text-[16px]">  
                                    <FormattedMessage id="costText2" />  
                                </div>  
                                <div className="text-start text-[15px] font-bold leading-[24px] text-white md:text-[16px]">  
                                    <FormattedMessage id="costText3" />  
                                </div>  
                                <div className="text-start text-[15px] font-bold leading-[24px] text-white md:text-[16px]">  
                                    <FormattedMessage id="costText4" />  
                                </div>  
                            </div>  
                        </div>  
                        <div className="relative size-full md:h-full md:w-1/5">  
                            <Image   
                                src='/resultCard1.jpg'  
                                alt=""   
                                layout="fill"  
                                objectFit="cover"   
                            />  
                        </div>   
                    </div>  
                    <div className="mt-10">  
                        <PlansPricingAllTable data={credential_items} selectedPlan={selectedPlan} />
                    </div>  
                </div>   
            </div>             
        </>  
    );  
};  

export default Home;