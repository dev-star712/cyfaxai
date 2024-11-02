import Image from "next/image";  
import { FormattedMessage, useIntl } from "react-intl";  
import BodyCard from "./components/BodyCard";  
import Header from "@/components/header";  
import { Search } from "lucide-react";  
import { ShieldPlus, FerrisWheel, Globe } from "lucide-react";  
import {useState} from "react";
import { toast } from "react-toastify";  
import { useSearch } from '@/context/searchContext';
import { useRouter } from 'next/router'; 

const Home = () => {  
  const intl = useIntl();  
  const router = useRouter();  
  const { setSearchValue } = useSearch();

  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validateInput = (value: string): boolean => {  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    const domainPattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;  
    return emailPattern.test(value) || domainPattern.test(value);  
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {  
    const value = e.target.value;  
    setInputValue(value);  
    setIsValid(validateInput(value));  
  };  

  const handleSearchClick = async () => {  
    if (!isValid || !inputValue) {  
      toast.error(intl.formatMessage({ id: "invalidEmailAndDomain" }));  
    } else {  
      setSearchValue(inputValue); 
      await router.push('/result');
    }  
  };  

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {  
    if (e.key === 'Enter') {  
      handleSearchClick();  
    }  
  };  

  return (  
    <>  
      <div className="bg-cover bg-center" style={{ backgroundImage: "url('/mainBG.png')" }}>  
        <Header />  
        <div className="flex min-h-[30vh] flex-col md:flex-row">   
          <div className="ml-4 flex flex-1 flex-col justify-center pt-5 text-left md:ml-28 md:pt-0">
            <div className="mt-5 text-[28px] font-bold text-white md:text-[48px]">   
              <FormattedMessage id="homeHeroTitle1" />  
            </div>  
            <div className="mb-4 text-[28px] font-bold text-white md:text-[48px]">  
              <FormattedMessage id="homeHeroTitle2" /><span style={{color: '#E400E4'}}><FormattedMessage id="homeHeroColorTitle" /></span>  
            </div>  
            <div className="mb-8 text-[16px] font-bold text-white md:text-[18px]">   
              <FormattedMessage id="smallTitle1" />  
            </div>  
            <div className="flex w-full items-center md:w-auto">  
              <div className="relative w-full pr-3 md:w-4/5 md:pr-0">  
                <input  
                  type="text"  
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={intl.formatMessage({  
                    id: "inputPlaceholder",  
                  })}  
                  className="h-10 w-full rounded-3xl border-none bg-white pl-3 pr-10 text-xs outline-none placeholder:text-xs md:text-base md:placeholder:text-base lg:h-12 lg:pl-5"  
                />  
                <button  
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}   
                  className="flex h-8 items-center justify-center rounded-3xl bg-[#720072] px-4 font-medium text-white duration-300 hover:opacity-80 disabled:opacity-50 md:right-2 md:h-10 lg:right-4"  
                  onClick={handleSearchClick}
                >  
                  <Search style={{ color: 'white' }} className="w-4 md:w-5 lg:w-6" />  
                  <span className="ml-2"><FormattedMessage id="searchText" /></span>  
                </button>  
              </div>  
            </div>
          </div>  
          <div className="mt-4 flex flex-1 items-center justify-center md:mt-0">   
            <Image  
              src="/shadow.png"  
              alt="Shadow"  
              className="max-h-full max-w-full"  
              width={700}  
              height={300}  
            />  
          </div>  
        </div>  
      </div>
      <div className="mx-auto px-5 lg:px-10 xl:w-[1521px] xl:px-0">  
        <h1 className="my-5 text-center font-mulish text-base font-semibold text-[#720072] md:text-2xl lg:my-9 lg:text-[36px] lg:font-bold lg:leading-[40px]">  
          <FormattedMessage id="siteName" />  
        </h1>  
        <p className="my-5 text-center font-mulish text-base font-semibold text-black md:text-xl lg:text-4xl lg:font-bold lg:leading-9">  
          <FormattedMessage id="homeHeroDescription" />  
          <span className="block text-[#720072] sm:inline">  
            <FormattedMessage id="homeHereDescriptionText" />  
          </span>  
        </p> 

        <div className="my-9 grid grid-cols-1 gap-y-5 md:grid-cols-3 md:gap-x-4 lg:gap-x-8 lg:gap-y-0">  
          <BodyCard heading="homeCard1Title" details="homeCard1Description" buttonText="monitorNow">
            <div className="flex size-12 items-center justify-center rounded-3xl bg-[#EDDEED]"> 
              <Globe className="size-6 text-[#720072] md:size-7 lg:size-8"/> 
            </div>    
          </BodyCard>  

          <BodyCard heading="homeCard2Title" details="homeCard2Description" buttonText="testNow">  
            <div className="flex size-12 items-center justify-center rounded-3xl bg-[#EDDEED]"> 
              <ShieldPlus className="size-6 text-[#720072] md:size-7 lg:size-8"/> 
            </div>        
          </BodyCard>  

          <BodyCard heading="homeCard3Title" details="homeCard3Description" buttonText="monitorNow">  
            <div className="flex size-12 items-center justify-center rounded-3xl bg-[#EDDEED]"> 
              <FerrisWheel className="size-6 text-[#720072] md:size-7 lg:size-8"/> 
            </div>
          </BodyCard>  
        </div>
        <div className="flex flex-wrap" style={{ height: '60vh' }}>  
          <div className="flex w-full flex-col items-start justify-center px-1 md:w-1/2 md:px-0">  
            <p className="my-5 text-start font-mulish text-[18px] font-semibold md:text-xl lg:my-9 lg:text-[28px] lg:font-bold lg:leading-[40px]">  
              <FormattedMessage id="desktopText" />  
              <span style={{ color: '#720072' }}>  
                <FormattedMessage id="desktopColorText" />  
              </span>  
            </p>  
            <p className="text-start font-mulish text-[12px] font-normal leading-[15px] text-[#000000] md:text-xs lg:text-base lg:font-medium lg:leading-6">  
              <FormattedMessage id='desktopDescription' />  
            </p>  
          </div>  
          <div className="relative mt-8 flex w-full items-center justify-center md:mt-0 md:w-1/2">  
            <Image  
              src="/imageShadow.png"  
              alt="Shadow"  
              className="max-h-full max-w-full"  
              width={450}  
              height={300}  
            />  
            <Image  
              src="/desktop.png"  
              alt="Desktop"  
              className="absolute z-10 mb-4 md:hidden"  
              width={230}   
              height={230}  
            />  
            <Image  
              src="/desktop.png"  
              alt="Desktop"  
              className="absolute z-10 hidden md:block"  
              width={300}   
              height={300}   
            />  
          </div>  
        </div>
        <div className="my-20 flex flex-wrap md:-mt-20 md:mb-0" style={{ height: '60vh' }}>  
          <div className="relative mt-8 hidden w-full items-center justify-center md:mt-0 md:flex md:w-1/2">  
            <Image  
              src="/imageShadow.png"  
              alt="Shadow"  
              className="max-h-full max-w-full"  
              width={450}  
              height={300}  
            />   
            
            <Image  
              src="/surveillance.png"  
              alt="Desktop"  
              className="absolute z-10 mb-4 md:hidden"  
              width={230}  
              height={230}  
            />   
            <Image  
              src="/surveillance.png"  
              alt="Desktop"  
              className="absolute z-10 hidden md:block"  
              width={300}  
              height={300}  
            />   
          </div>
          <div className="flex w-full flex-col items-start justify-center px-1 md:w-1/2 md:px-0">  
            <p className="my-5 text-start font-mulish text-[18px] font-semibold md:text-xl lg:my-9 lg:text-[28px] lg:font-bold lg:leading-[40px]">  
              <FormattedMessage id="surveillanceText" />  
              <span style={{ color: '#720072' }}>  
                <FormattedMessage id="surveillanceColorText" />  
              </span>  
            </p>  
            <p className="text-start font-mulish text-[12px] font-normal leading-[15px] text-[#000000] md:text-xs lg:text-base lg:font-medium lg:leading-6">  
              <FormattedMessage id='desktopDescription' />  
            </p>  
          </div>  
          <div className="relative mt-8 flex w-full items-center justify-center md:mt-0 md:hidden md:w-1/2">  
            <Image  
              src="/imageShadow.png"  
              alt="Shadow"  
              className="max-h-full max-w-full"  
              width={450}  
              height={300}  
            />   
            
            <Image  
              src="/surveillance.png"  
              alt="Desktop"  
              className="absolute z-10 mb-4 md:hidden"  
              width={230}  
              height={230}  
            />   
          </div>
        </div>
      </div>  
    </>  
  );  
};  

export default Home;