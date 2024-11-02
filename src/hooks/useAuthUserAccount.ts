import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/cookies";  
import routes from "@/constants/routes";  
import { getLogoutMutationOptions } from "@/cyfax-api-client/mutations";  
import {  
  getAuthTokensQueryOptions,  
  getAuthUserAccountQueryOptions,  
} from "@/cyfax-api-client/queries";  
import { getApiErrorMessage } from "@/lib/utils";  
import { appCache } from "@/node-cache";  
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";  
import { atom, useAtom } from "jotai";  
import { useRouter } from "next/router";  
import { useEffect } from "react";  
import { toast } from "react-toastify";  
import useAuthStore from "@/stores/authStore";

const accessTokenAtom = atom<null | string>(null);  

const useAuthUserAccount = () => {  
  const {setIsLoggedOut} = useAuthStore()
  const router = useRouter();  
  const queryClient = useQueryClient();  
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);  

  const authUserAccountQuery = useQuery({  
    ...getAuthUserAccountQueryOptions(),  
    retry: false,  
    enabled: !!accessToken,  
    gcTime: 60 * 1000 * 2,  
  });  

  const logoutMutation = useMutation({  
    ...getLogoutMutationOptions(),  
    onSuccess: async () => {  
      try {  
        clearSession();  
        broadcastLogout();  
        await router.push(routes.login);  
      } catch (error) {  
        console.error("Error during logout:", error);  
        toast.error(getApiErrorMessage(error, "Failed to logout. Please try again."));  
      }  
    },  
  });  
  
  const broadcastLogout = () => {  
    setIsLoggedOut(true);
};  
  
  const clearSession = () => {  
    appCache.del(ACCESS_TOKEN.name);  
    appCache.del(REFRESH_TOKEN.name);  
  
    document.cookie = `${ACCESS_TOKEN.name}=; Max-Age=0; path=/;`;  
    document.cookie = `${REFRESH_TOKEN.name}=; Max-Age=0; path=/;`;  
    
    setIsLoggedOut(true);
    
    setAccessToken(null);  
    queryClient.removeQueries();  
  };  
  
  useEffect(() => {  
    const handleStorage = (event: StorageEvent) => {  
      if (event.key === "isLoggedOut" && event.newValue === "true") {  
        clearSession();  
        router.push(routes.login);  
      }  
    };  
    
    window.addEventListener("storage", handleStorage);  
  
    return () => window.removeEventListener("storage", handleStorage);  
  }, []);
  
  const getAuthTokensQuery = useQuery({  
    ...getAuthTokensQueryOptions(),  
  });  

  useEffect(() => {  
    setAccessToken(getAuthTokensQuery.data?.access_token || null);  
  }, [getAuthTokensQuery.data?.access_token, setAccessToken]);  

  const queryData = authUserAccountQuery.data?.data;  

  return {  
    authUserAccountQuery,  
    data: queryData,  
    logoutMutation,  
    logout: logoutMutation.mutate,  
    logoutAsync: logoutMutation.mutateAsync,  
    isAdmin: !!queryData?.is_admin,  
    hasAuth: !!accessToken,  
    accessToken,  
    setAccessToken,  
  };  
};  

export default useAuthUserAccount;