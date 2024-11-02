import Header from "@/components/header";  
import Footer from "@/components/footer";  
import Sidebar from "@/components/sidebar";  
import Spinner from "@/components/ui/spinner";  
import { ACCESS_TOKEN } from "@/constants/cookies";  
import useAuthUserAccount from "@/hooks/useAuthUserAccount";  
import useIdleLogout from "@/hooks/useIdleLogout";  
import { appCache } from "@/node-cache";  
import { ReactNode, useEffect } from "react";  
import { useRouter } from "next/router";  

const Layout = ({ children }: { children: ReactNode }) => {  
  useIdleLogout();  

  const { authUserAccountQuery, setAccessToken } = useAuthUserAccount();  
  const router = useRouter();  

  useEffect(() => {  
    const handleOnSet = (key: string, value: string) => {  
      if (key === ACCESS_TOKEN.name) {  
        setAccessToken(value);  
      }  
    };  
    const handleOnDelete = (key: string) => {  
      if (key === ACCESS_TOKEN.name) {  
        setAccessToken(null);  
      }  
    };  

    appCache.on("set", handleOnSet);  
    appCache.on("del", handleOnDelete);  

    return () => {  
      appCache.off("set", handleOnSet);  
      appCache.off("del", handleOnDelete);  
    };  
  }, [setAccessToken]);  

  if (  
    authUserAccountQuery.isLoading &&  
    authUserAccountQuery.fetchStatus !== "idle"  
  ) {  
    return (  
      <div className="grid h-screen place-items-center">  
        <Spinner />  
      </div>  
    );  
  }  
  const isNewPages = router.pathname !== "/" && router.pathname !== "/contact-us" && router.pathname !== "/result" && router.pathname !== "/plans-pricing"
  return (  
    <>  
      {isNewPages && <Header />}  
      <div className={`flex ${isNewPages ? "flex-col lg:flex-row" : ""}`}>  
        {isNewPages && <Sidebar />}  
        <div className={`${isNewPages ? "h-[calc(100vh-80px)]" : "h-auto"} grow overflow-auto`}>  
          {children}  
        </div>  
      </div>  
      {!isNewPages && <Footer />}
    </>  
  );  
};  

export default Layout;