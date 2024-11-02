import { useRouter } from 'next/router';  
import LanguageDropDown from "@/components/language-dropdown";  
import Sidebar from "@/components/mobile-sidebar";  
import {  
  DropdownMenu,  
  DropdownMenuContent,  
  DropdownMenuItem,  
  DropdownMenuTrigger,  
} from "@/components/ui/dropdown-menu";  
import routes from "@/constants/routes";  
import { FormattedMessage } from "react-intl";  
import useAuthUserAccount from "@/hooks/useAuthUserAccount";  
import { ChevronDown, LogOut, ListRestart, Globe } from "lucide-react";  
import Link from "next/link";  
import { useState, useEffect } from "react";  
import { toast } from "react-toastify";  
import Image from "next/image";  
import { getAuthTokenOnClient } from "@/lib/utils";  

const Header = () => {  
  const router = useRouter();  
  const { data, logout } = useAuthUserAccount();  
  const [loading, setLoading] = useState(false);  
  const [accessToken, setAccessToken] = useState<string | null>(null);  

  useEffect(() => {  
    const fetchToken = async () => {  
      try {  
        const tokens = await getAuthTokenOnClient();  
        if (tokens && typeof tokens === 'object' && 'accessToken' in tokens) {  
          setAccessToken(tokens.accessToken as string);  
        } else {  
          setAccessToken(null);  
        }  
      } catch (error) {  
        console.error("Error fetching access token:", error);  
      }  
    };  

    fetchToken();  
  }, []);  

  const resetPassword = async () => {  
    setLoading(true);  
    try {  
      const tokens = await getAuthTokenOnClient();  
      const response = await fetch(`${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/reset_password/`, {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
          'Authorization': `Bearer ${tokens.accessToken}`,  
        },  
      });  

      if (response.ok) {  
        toast.success('Please check your email to reset your password.');  
      } else {  
        throw new Error('Failed to send reset password email.');  
      }  
    } catch (error) {  
      console.error('Reset password error:', error);  
      toast.error('Failed to reset password. Please try again.');  
    } finally {  
      setLoading(false);  
    }  
  };  

  const isHomePage = router.pathname === '/' || router.pathname === '/contact-us' || router.pathname === '/result' || router.pathname === '/plans-pricing';  
  const isContact = router.pathname === '/contact-us';  

  return (  
    <div className={`flex items-center justify-between max-lg:py-1.5 lg:px-0 ${isContact ? 'bg-[#09171B]' : !isHomePage ? 'bg-white lg:bg-[#13101c]' : ''} px-4`}>  
      <div className="flex h-[43px] items-center justify-center lg:h-20 lg:w-[300px]">  
        <Link href={routes.home}>  
          <Image src="/site-logo.png" width="50" height="50" alt="Microsoft Teams Icon"/>  
        </Link>  
      </div>  
      {isHomePage && (  
        <div className="hidden items-center justify-between md:flex md:space-x-10">  
          <Link href={accessToken ? routes.dashboard : routes.login}>  
            <p className="font-mulish text-base font-normal leading-5 text-gray-200">  
              <FormattedMessage id="products" />  
            </p>  
          </Link>  
          <Link href={routes.prices}>  
            <p className="font-mulish text-base font-normal leading-5 text-gray-200">  
              <FormattedMessage id="plans" />  
            </p>  
          </Link>  
        </div>  
      )}

      <div className="flex grow items-center justify-end space-x-3 rounded-lg md:space-x-5 lg:mr-5">  
        <div className="hidden items-center lg:flex" style={{ transform: 'translateX(-20px)' }}>  
          {isHomePage && !accessToken && (
            <>  
              <Link href={routes.login}>  
                <button  
                  className="ml-4 h-10 w-32 rounded-3xl bg-[#720072] text-base font-semibold text-white duration-300 hover:bg-[#ab00ab] md:text-lg lg:text-lg"  
                >  
                  <FormattedMessage id="loginText" />  
                </button>  
              </Link>  
              <Link href={routes.prices}>  
                <button  
                  className="ml-4 h-10 w-32 rounded-3xl bg-white text-base font-semibold text-[#720072] duration-300 hover:opacity-80 md:text-lg lg:text-lg"  
                >  
                  <FormattedMessage id="signUpText" />  
                </button>  
              </Link>  
            </>  
          )}  
          <Globe className="ml-10 mr-2 size-5 text-white"/>  
          <LanguageDropDown />  
        </div>  

        {data && (  
          <div style={{ transform: 'translateX(-20px)' }}>  
            <DropdownMenu>  
              <DropdownMenuTrigger asChild>  
                <div className="flex cursor-pointer flex-row items-center gap-x-2">  
                  <h3 className="hidden font-mulish text-base font-normal leading-5 text-gray-200 lg:block">  
                    {data?.full_name || data?.email}  
                  </h3>  
                  <ChevronDown className="size-5 text-white" />  
                </div>  
              </DropdownMenuTrigger>  

              <DropdownMenuContent  
                collisionPadding={10}  
                sideOffset={10}  
                className="min-w-[200px]"  
              >  
                <DropdownMenuItem onClick={() => !loading && resetPassword()}>  
                  <ListRestart className="size-4" /> <FormattedMessage id="resetPassword" />  
                </DropdownMenuItem>  
                <DropdownMenuItem onClick={() => logout()}>  
                  <LogOut className="size-4" /> <FormattedMessage id="logOut" />  
                </DropdownMenuItem>  
              </DropdownMenuContent>  
            </DropdownMenu>  
          </div>  
        )}  

        <div className="lg:hidden">  
          <Sidebar />  
        </div>  
      </div>  
    </div>  
  );  
};  

export default Header;