import React, { useState, FormEvent } from 'react';  
import IconSms from "@/components/icons/icon-sms";  
import { ArrowLeft } from 'lucide-react';  
import { FormattedMessage, useIntl } from "react-intl";  
import Link from "next/link";  
import routes from "@/constants/routes";  

const ForgotPassword = () => {  
  const [email, setEmail] = useState('');  
  const intl = useIntl();  

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {  
    e.preventDefault(); // Prevents the default form submission behavior  

    // Replace this URL with your actual password reset API endpoint  
    const resetPasswordApiEndpoint = 'https://yourapi.com/reset-password';  

    try {  
      const response = await fetch(resetPasswordApiEndpoint, {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({ email }),  
      });  

      if (response.ok) {  
        // Handle success - maybe set a message to show the link was sent or redirect the user  
        alert('Check your email for the reset link.');  
      } else {  
        // Handle server errors or invalid requests  
        alert('Something went wrong. Please try again.');  
      }  
    } catch (error) {  
      // Handle network errors  
      console.error("Failed to send reset email:", error);  
    }  
  };  

  return (  
    <div className="p-5 font-inter md:py-10 lg:py-[233px]">  
      <div className="mx-auto max-w-[642px]">  
        <Link  
          href={routes.login}  
          className="mb-8 mt-4 flex justify-end text-sm text-[#720072] underline-offset-4 duration-300 hover:opacity-90 max-md:font-medium md:underline"  
        >  
          <ArrowLeft className='mr-2 size-5' />  
          <FormattedMessage id="goBack" />  
        </Link>  
        <form onSubmit={handleResetPassword} className='flex flex-col'>  
          <div className='mb-8 flex flex-col items-center justify-center space-y-1 text-center'>  
            <h2 className="text-[40px] font-medium leading-[150%]">  
              <FormattedMessage id="resetPasswordTitle" />  
            </h2>  
    
            <h2 className="text-[18px] font-medium leading-[150%]">  
              <FormattedMessage id="resetPasswordDescription" />  
            </h2>  
          </div>  
          
          <div className="relative mb-8">  
            <input  
              type="email"  
              className="h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl md:pl-[60px]"  
              placeholder={intl.formatMessage({ id: "email" })}  
              value={email}  
              onChange={e => setEmail(e.target.value)}  
              required  
            />  
            <IconSms className="absolute left-6 top-1/2 max-w-6 -translate-y-1/2 text-black/60 max-md:hidden" />  
          </div>  
          <button   
            className="h-[56px] w-full rounded-[10px] bg-[#720072] text-center font-semibold text-white duration-300 hover:opacity-90 md:h-[75px] md:rounded-[15px] md:text-xl"  
            type="submit"  
          >  
            <FormattedMessage id="sendALink" />  
          </button>  
        </form>  
      </div>  
    </div>  
  );  
};  

export default ForgotPassword;