import Router from 'next/router';  
import routes from "@/constants/routes";
import {useEffect} from 'react';
import useAuthUserAccount from "@/hooks/useAuthUserAccount";
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";

export default function MyComponent() {  
  const { data } = useAuthUserAccount();  
  const {roleNameToIdMap} = useDetailReport()
  const roleString = data?.role ? roleNameToIdMap[data.role] : undefined;
  useEffect(() => {  
    Router.push(routes.orgManagement);  
    if (roleString) {  
      switch (roleString) {  
        case 'client_admin':  
          Router.push(routes.userManagement);  
          break;  
        case 'super_admin':  
        case 'partner_admin':  
          Router.push(routes.orgManagement);  
          break;  
      }  
    } 
  }, []);  

  return null;
}