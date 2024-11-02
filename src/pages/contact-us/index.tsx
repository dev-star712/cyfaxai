import Image from "next/image";  
import Header from "@/components/header";  
import { FormattedMessage, useIntl } from "react-intl";  
import { useState, useEffect } from "react";  
import { useSelectedValue } from '@/context/selectedPriceContext';  
import { toast } from "react-toastify";

const ContactUs = () => {  
    const intl = useIntl();  
    const [jobs, setJobs] = useState<string[]>([]);  
    const [countries, setCountries] = useState<string[]>([]);  
    const { selectedPlan } = useSelectedValue();  

    const [contactEmail, setContactEmail] = useState<string>('');  
    const [isEmailValid, setIsEmailValid] = useState<boolean>(true);  
    const [firstName, setFirstName] = useState<string>('');  
    const [lastName, setLastName] = useState<string>('');  
    const [companyName, setCompanyName] = useState<string>('');  
    const [companyLocation, setCompanyLocation] = useState<string>('');  
    const [jobTitle, setJobTitle] = useState<string>('');  
    const [phoneNumber, setPhoneNumber] = useState<string>('');  
    const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);  

    const validateEmail = (email: string): boolean => {  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
        return emailRegex.test(email);  
    };  

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
        const email = e.target.value;  
        setContactEmail(email);  
        setIsEmailValid(validateEmail(email));  
    };  

    const getOptions = async () => {  
        try {  
            const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/user_contact/`;  
            const response = await fetch(apiUrl, {  
                method: "OPTIONS",  
                headers: {  
                    "Content-Type": "application/json",  
                },  
            });  
            if (!response.ok) {  
                const errorResponse = await response.json();  
                throw new Error(errorResponse.data);  
            }  
            const data = await response.json();  
            setJobs(data?.data?.position_list || []);  
            setCountries(data?.data?.country_list || []);  
        } catch (error) {  
            console.error('Failed to get options:', error);  
            const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
            console.error(`Failed to get options: ${errorMessage}`);  
        }  
    };  

    useEffect(() => {  
        getOptions();  
    }, []);  

    const isFormValid = contactEmail && isEmailValid && firstName && lastName && companyName && companyLocation && jobTitle && phoneNumber;  

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
        e.preventDefault(); 
    
        const requestData = {  
            email: contactEmail,  
            first_name: firstName,  
            last_name: lastName,  
            company_name: companyName,  
            company_location: companyLocation,  
            job_title: jobTitle,  
            phone_number: phoneNumber,  
            is_security_manager: String(isCheckboxChecked),  
            plan: selectedPlan  
        };  
    
        try {  
            const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/user_contact/`;  
            const response = await fetch(apiUrl, {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                body: JSON.stringify(requestData),  
            });  
    
            if (response.status === 409) {  
                try {  
                    const jsonResponse = await response.json();  
                    const errorMessage = jsonResponse.data || "Conflict encountered, but no message provided.";  
                    toast.error(errorMessage);  
                } catch (error) {  
                    toast.error("Conflict encountered, and the error message couldn't be parsed.");  
                }  
                return;  
            }  
    
            if (!response.ok) {  
                const errorResponse = await response.json();  
                throw new Error(`Failed to submit contact data: ${errorResponse.message}`);  
            }  
            const data = await response.json();  
            toast.success(data.data);  
    
        } catch (error) {  
            console.error('Failed to contact with me:', error);  
            const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
            toast.error(`Failed to contact with me. ${errorMessage}`);  
        }  
    };
  
    return (  
        <>  
            <Header />  
            <div className="flex h-screen flex-col lg:flex-row">  
                <div className="relative w-full lg:hidden">  
                    <div className="relative h-[550px] w-full">  
                        <Image  
                            src="/contact.png"  
                            alt="Contact Us"  
                            layout="fill"  
                            objectFit="cover"  
                        />  
                    </div>  
                </div>  
                <div style={{ backgroundColor: "RGB(235, 236, 237)" }} className="flex w-full flex-col items-start justify-start px-6 pt-10 lg:w-1/2 lg:px-24">  
                    <p className="text-center font-mulish text-[28px] font-semibold md:text-2xl lg:my-2 lg:text-[36px] lg:font-bold lg:leading-[40px]">  
                        <FormattedMessage id="contact" />  
                        <span style={{ color: "#720072" }}><FormattedMessage id="us" /></span>  
                    </p>  
                    <div>  
                        <p className="text-start font-mulish text-[12px] font-normal leading-[15px] text-[#000000] md:text-xs lg:text-base lg:font-medium lg:leading-6">  
                            <FormattedMessage id="contactSubText" />  
                        </p>  
                    </div>  
                    <div className="mt-7 w-full">  
                        <form onSubmit={handleSubmit}>  
                            <label htmlFor="contactEmail" style={{ fontSize: '18px' }} className="mb-2 block font-bold text-gray-900">  
                                <FormattedMessage id="contactEmailText" />  
                            </label>  
                            <input  
                                id="contactEmail"  
                                type="text"  
                                placeholder={intl.formatMessage({ id: "contactEmailPlaceholder" })}  
                                className={`mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4 ${isEmailValid ? '' : 'border-red-500'}`}  
                                value={contactEmail}  
                                onChange={handleEmailChange}  
                            />  
                            {!isEmailValid && (  
                                <p className="text-red-500 text-sm">Please enter a valid email address.</p>  
                            )}  
                            <div className="mt-2"></div>  
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>  
                                <div>  
                                    <label htmlFor="firstName" style={{ fontSize: '18px' }} className="mb-2 block font-bold text-gray-900">  
                                        <FormattedMessage id="firstNameText" />  
                                    </label>  
                                    <input  
                                        id="firstName"  
                                        type="text"  
                                        className="h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                                        value={firstName}  
                                        onChange={(e) => setFirstName(e.target.value)}  
                                    />  
                                </div>  
                                <div>  
                                    <label htmlFor="lastName" style={{ fontSize: '18px' }} className="mb-2 block font-bold text-gray-900">  
                                        <FormattedMessage id="lastNameText" />  
                                    </label>  
                                    <input  
                                        id="lastName"  
                                        type="text"  
                                        className="h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                                        value={lastName}  
                                        onChange={(e) => setLastName(e.target.value)}  
                                    />  
                                </div>  
                            </div>  
                            <div className="mt-2"></div>  
                            <label htmlFor="companyName" style={{ fontSize: '18px' }} className="mb-2 block font-bold text-gray-900">  
                                <FormattedMessage id="companyNameText" />  
                            </label>  
                            <input  
                                id="companyName"  
                                type="text"  
                                className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                                value={companyName}  
                                onChange={(e) => setCompanyName(e.target.value)}  
                            />  
                            <div className="mt-2"></div>  
                            <label htmlFor="companyLocation" style={{ fontSize: '18px' }} className="mb-2 block font-bold text-gray-900">  
                                <FormattedMessage id="companyLocation" />  
                            </label>  
                            <select  
                                id="companyLocation"  
                                className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none md:text-base lg:h-12 lg:px-4"  
                                value={companyLocation}  
                                onChange={(e) => setCompanyLocation(e.target.value)}  
                            >  
                                <option value=""><FormattedMessage id="pleaseSelect" /></option>  
                                {countries.map((country, index) => (  
                                    <option key={index} value={country}>{country}</option>  
                                ))}  
                            </select>  
                            <div className="mt-2"></div>  
                            <label htmlFor="jobTitle" style={{ fontSize: '18px' }} className="mb-2 block font-bold text-gray-900">  
                                <FormattedMessage id="jobTitle" />  
                            </label>  
                            <select  
                                id="jobTitle"  
                                className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none md:text-base lg:h-12 lg:px-4"  
                                value={jobTitle}  
                                onChange={(e) => setJobTitle(e.target.value)}  
                            >  
                                <option value=""><FormattedMessage id="pleaseSelect" /></option>  
                                {jobs.map((job, index) => (  
                                    <option key={index} value={job}>{job}</option>  
                                ))}  
                            </select>  
                            <div className="mt-2"></div>  
                            <label htmlFor="phoneNumber" style={{ fontSize: '18px' }} className="mb-2 block font-bold text-gray-900">  
                                <FormattedMessage id="phoneNumberText" />  
                            </label>  
                            <input  
                                id="phoneNumber"  
                                type="text"  
                                className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                                value={phoneNumber}  
                                onChange={(e) => setPhoneNumber(e.target.value)}  
                            />  
                            <div className="mt-2"></div>  
                            <label className="flex min-w-[120px] cursor-pointer items-center space-x-2">  
                                <input type="checkbox" name="contactCheckbox" className="size-4 md:size-6" checked={isCheckboxChecked} onChange={(e) => setIsCheckboxChecked(e.target.checked)} />  
                                <span className="text-[14px] font-bold text-gray-900 sm:text-[18px]">  
                                    <FormattedMessage id="contactCheckbox" />  
                                </span>  
                            </label>  
                            <div className="mt-2"></div>  
                            <p className="text-start font-mulish text-[12px] font-normal leading-[15px] text-[#000000] md:text-xs lg:text-base lg:font-medium lg:leading-6">  
                                <FormattedMessage id="submitWarning1" />  
                                <span className="font-bold"><FormattedMessage id="submitWarning2" /></span>  
                            </p>  
                            <div className="mb-16 mt-5 flex sm:mb-0">  
                                <button  
                                    type="submit"  
                                    className="h-11 w-full rounded-3xl bg-[#720072] px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                                    disabled={!isFormValid}  
                                >  
                                    <FormattedMessage id="submitText" />  
                                </button>  
                            </div>  
                        </form>  
                    </div>  
                </div>  
                <div className="relative hidden w-1/2 items-center justify-center lg:flex">  
                    <div className="absolute inset-0 flex items-center justify-center">  
                        <Image  
                            src="/contact.png"  
                            alt="Desktop"  
                            layout="fill"  
                            objectFit="cover"  
                            className="z-10"  
                        />  
                    </div>  
                </div>  
            </div>  
        </>  
    );  
};  

export default ContactUs;