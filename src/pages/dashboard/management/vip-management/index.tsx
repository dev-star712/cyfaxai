// vip-management.tsx  
import { Formik } from "formik";  
import { FormattedMessage, useIntl } from "react-intl";  
import { useFormikContext, useField } from "formik";  
import { useState, KeyboardEvent, useEffect, useRef } from "react";  
import { XCircle } from 'lucide-react';  
import useAuthUserAccount from "@/hooks/useAuthUserAccount";  
import routes from "@/constants/routes";  
import Router from 'next/router';  

import { getAuthTokenOnClient } from "@/lib/utils";  
import { toast } from "react-toastify";  
import { useRouter } from 'next/router';  
import { useDataContext } from '@/context/DataContext'; // Import DataContext  

const OrgManagement = () => {  
  const intl = useIntl();  
  const { data } = useAuthUserAccount();  
  const roleName = data?.role_name;  
  const [executives_usernames, setUsernames] = useState<string[]>([]);  
  const [executives_corporate_emails, setCorporateEmails] = useState<string[]>([]);  
  const [executives_personal_emails, setPersonalEmails] = useState<string[]>([]);  
  const { setData } = useDataContext();
  const router = useRouter();  
  
  const groupKindValue = (roleName === 'super_admin' || roleName === 'partner_admin' || roleName === 'partner_user') ? 'partner' : 'client';  
  
  const getVIPs = async() => {  
    const tokens = await getAuthTokenOnClient();  
    try {  
        const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/vip_management/?query_type=config`;  
        const response = await fetch(apiUrl, {  
            method: "GET",  
            headers: {  
                "Content-Type": "application/json",  
                'Authorization': `Bearer ${tokens.accessToken}`,  
            },  
        });  
        if (!response.ok) {  
            const errorResponse = await response.json();   
            throw new Error(errorResponse.data);  
        }   
        const data = await response.json();  
        setUsernames(data?.data.executives_usernames || []);  
        setCorporateEmails(data?.data.executives_corporate_emails || []);  
        setPersonalEmails(data?.data.executives_personal_emails || []);  
    } catch (error) {  
        console.error('Failed to retrieve VIP data:', error);   
    }  
  }  

  useEffect(() => {  
    getVIPs();  
  }, []);  

  return (  
    <Formik  
      initialValues={{   
        usernames: executives_usernames,   
        corporateEmails: executives_corporate_emails,   
        personalEmails: executives_personal_emails   
      }}  
      enableReinitialize={true}  
      onSubmit={async (values) => {  
        try {  
          const tokens = await getAuthTokenOnClient();  
          const response = await fetch(`${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/vip_management/`, {  
            method: "POST",  
            headers: {  
              "Content-Type": "application/json",  
              "Authorization": `Bearer ${tokens.accessToken}`,  
            },  
            body: JSON.stringify({  
              executives_usernames: values.usernames,  
              executives_corporate_emails: values.corporateEmails,  
              executives_personal_emails: values.personalEmails,  
            }),  
          });  
    
          if (!response.ok) {  
            const errorData = await response.json();  
            console.error("Failed to save data:", errorData);  
            return;  
          }  
          
          const data = await response.json();  
          toast.success(data?.data);   
        } catch (error) {  
          console.error('Failed to save VIP management:', error);  
          const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
          toast.error(`Failed to save VIP management. ${errorMessage}`);  
        }  
      }}  
    >  
      {({    
        handleSubmit,  
        setFieldValue,  
        values,  
      }) => (  
        <form  
          onSubmit={(e) => {  
            e.preventDefault();  
            handleSubmit();  
          }}  
          className="p-4 font-inter md:p-6"  
        >  
          <h2 className="font-mulish text-base font-semibold md:text-xl lg:text-2xl/[120%]">  
            <FormattedMessage id="vipManagement" />  
          </h2>  
          <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl md:p-5 md:shadow-[0_0_12px_rgba(0,0,0,0.12)]">  
            <FormikDomainInput  
              name="usernames"  
              label="executiveSuiteUsernames"  
              placeholder={intl.formatMessage({ id: "inputExecutiveSuiteUsernames" })}  
              onChange={(domains) => setFieldValue("usernames", domains)}  
              groupKind={groupKindValue}  
              setData={setData}  
              router={router}  
            />  

            <FormikDomainInput  
              name="corporateEmails"  
              label="executiveSuiteCorporateEmails"  
              placeholder={intl.formatMessage({ id: "inputExecutiveSuiteCorporateEmails" })}  
              onChange={(domains) => setFieldValue("corporateEmails", domains)}  
              groupKind={groupKindValue}  
              setData={setData}  
              router={router}  
            />  

            <FormikDomainInput  
              name="personalEmails"  
              label="executiveSuitePersonalEmails"  
              placeholder={intl.formatMessage({ id: "inputExecutiveSuitePersonalEmails" })}  
              onChange={(domains) => setFieldValue("personalEmails", domains)}  
              groupKind={groupKindValue}  
              setData={setData}  
              router={router}  
            />  
          </div>  
          <div className="mt-8 flex justify-end">  
            <button  
              type="submit"  
              disabled={!(values.usernames.length > 0 || values.corporateEmails.length > 0 || values.personalEmails.length > 0)}  
              className={`h-14 w-32 rounded-lg px-8 text-base font-semibold text-white duration-300 sm:w-40 md:text-lg lg:text-xl ${  
                !(values.usernames.length > 0 || values.corporateEmails.length > 0 || values.personalEmails.length > 0)   
                  ? 'bg-[#c271c2] hover:opacity-100'   
                  : 'bg-[#720072] hover:opacity-90'  
              }`}  
            >  
              <FormattedMessage id="save" />   
            </button>  
          </div>  
        </form>  
      )}  
    </Formik>  
  );  
};   

export default OrgManagement;  

interface FormikDomainInputProps {  
  name: string;  
  groupKind: string;  
  label?: string;  
  placeholder?: string;  
  onChange?: (domains: string[]) => void;  
  setData: (data: any) => void;  
  router: any;  
}  

const FormikDomainInput: React.FC<FormikDomainInputProps> = ({ name, groupKind, label, placeholder, onChange, setData, router }) => {  
  const { setFieldValue } = useFormikContext();  
  const [field, meta] = useField(name);  
  const [inputValue, setInputValue] = useState("");  
  const containerRef = useRef<HTMLDivElement>(null);  

  useEffect(() => {  
    if (containerRef.current) {  
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;  
    }  
  }, [field.value]);  

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {  
    if (e.key === 'Enter') {  
      e.preventDefault();  
      e.stopPropagation();  

      if (inputValue.trim() !== '') {  
        const newDomains = (groupKind === 'client' ? [inputValue.trim()] : [...field.value, inputValue.trim()]);  
        setFieldValue(name, newDomains, true);  
        onChange && onChange(newDomains);  
        setInputValue("");  
      }  
    }  
  };  

  const removeDomain = (domainToRemove: string) => {  
    const newDomains = field.value.filter((domain: string) => domain !== domainToRemove);  
    setFieldValue(name, newDomains, true);  
  };  

  const handleSeeAllClick = async (e: React.MouseEvent<HTMLButtonElement>) => {  
    e.preventDefault();  
    e.stopPropagation();  

    const queryTypeMap: { [key: string]: string } = {  
      usernames: 'username',  
      corporateEmails: 'corporate_email',  
      personalEmails: 'personal_email',  
    };  

    const queryType = queryTypeMap[name];  
    const tokens = await getAuthTokenOnClient();  

    try {  
      const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/vip_management/?query_type=${queryType}`;  
      const response = await fetch(apiUrl, {  
        method: 'GET',  
        headers: {  
          'Content-Type': 'application/json',  
          Authorization: `Bearer ${tokens.accessToken}`,  
        },  
      });  

      if (!response.ok) {  
        const errorResponse = await response.json();  
        throw new Error(errorResponse.data);  
      }  

      const data = await response.json();  
      console.log(`Fetched data for ${name}:`, data?.data); 
      setData(data?.data); 
      Router.push(routes.see_all_vips(name));  
    } catch (error) {  
      console.error(`Failed to retrieve data for ${name}:`, error);  
    }  
  };

  return (  
    <div>  
      <div className="mb-4 flex items-center justify-between">  
        {label && <label className="inline-block text-sm font-medium md:text-base lg:text-xl"><FormattedMessage id={label} /></label>}  
        <button   
          onClick={handleSeeAllClick}  
          className="text-sm font-medium text-[#720072] duration-300 hover:opacity-90 lg:text-xl lg:font-semibold"  
        >  
          <FormattedMessage id="seeAll" />  
        </button>  
      </div>  
      <div className="relative flex items-center gap-2 overflow-x-auto rounded-[10px] border bg-black/10 px-3 py-2 outline-none backdrop-blur-xl md:h-[66px] lg:h-[70px]" ref={containerRef}>  
        {field.value.map((domain: string, index: number) => (  
          <div key={index} className="flex items-center gap-2 rounded bg-blue-100 px-2 py-1">  
            {domain}  
            <XCircle className="size-4 cursor-pointer text-blue-500" onClick={() => removeDomain(domain)} />  
          </div>  
        ))}  
        <input  
          type="text"  
          value={inputValue}  
          onChange={(e) => setInputValue(e.target.value)}  
          onKeyDown={handleKeyDown}  
          placeholder={placeholder}  
          className="flex-1 border-none bg-transparent outline-none placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm"  
        />  
      </div>  
      {meta.touched && meta.error && <div className="text-sm text-red-500">{meta.error}</div>}  
    </div>  
  );  
};