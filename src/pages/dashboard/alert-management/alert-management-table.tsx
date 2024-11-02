// alert-management-table.tsx  

import { useEffect, useState } from "react";  
import { FormattedMessage } from "react-intl";  
import Link from "next/link";  
import { useAlertContext } from '@/context/alertContext';   
import routes from "@/constants/routes";  
import DeleteDialog from './alert-delete';   

interface AlertsManagementTableProps{  
  alerts: any[];  
}  

const capitalizeWords = (s: string) => {  
  if (typeof s !== 'string') {  
    return '';   
  }  

  return s  
    .replace(/_/g, ' ')  
    .split(' ')  
    .map(word => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ''))  
    .join(' ');  
};  

const AlertManagementTable: React.FC<AlertsManagementTableProps> = ({ alerts: initialAlerts }) => {  
  const { setSelectedAlert } = useAlertContext();  
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);  
  const [selectedAlert, setSelectedAlertState] = useState<Alert | null>(null);  
  const [alerts, setAlerts] = useState(initialAlerts);
  useEffect(()=>{
    setAlerts(initialAlerts);
  }, [initialAlerts])

  const handleAlertClick = (alert: Alert) => {  
    setSelectedAlert(alert);  
  };  

  const handleDeleteClick = (alert: any) => {  
    setSelectedAlertState(alert);  
    setIsDeleteVisible(true);  
  };  

  const handleDeleteClose = () => {  
    setIsDeleteVisible(false);  
  };  

  const handleDeleteSuccess = (alertId: string) => {  
    setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== alertId)); 
  };  

  const displayGroupNameOrNA = (alert: Alert) => {  
    if (!alert.group_name) {  
      return 'N/A';  
    } else {  
      return capitalizeWords(alert.group_name);  
    }  
  };  

  return (  
    <>  
      <div>  
        <table className="w-full max-lg:hidden">  
          <thead>  
            <tr className="bg-[#60605B]/[.07] [&>th]:py-3.5 [&>th]:text-center [&>th]:font-semibold">  
              <th>  
                <FormattedMessage id="#" />  
              </th>  
              <th>  
                <FormattedMessage id="companyName" />  
              </th>  
              <th>  
                <FormattedMessage id="domain" />  
              </th>  
              <th>  
                <FormattedMessage id="ownerEmail" />  
              </th>  
              <th style={{textAlign: 'center'}}>  
                <FormattedMessage id="notification" />  
              </th>  
            </tr>  
          </thead>  
          <tbody>  
            {alerts && alerts.map((alert, index) => (  
              <tr   
                className="h-20 border-b py-4 text-sm"  
                key={alert.id}  
              >  
                <td className="text-center">  
                  <button className="size-full">{index+1}</button>  
                </td>  
                <td className="text-center">  
                  <button className="size-full">{displayGroupNameOrNA(alert)}</button>  
                </td>  
                <td className="text-center">  
                  <button className="size-full">{alert.domain_name}</button>  
                </td>  
                <td className="text-center">  
                  <button className="size-full">{alert.owner_email}</button>  
                </td>   
                <td className="justify-center text-center">  
                  <Link   
                    href={routes.alertType}   
                    onClick={() => handleAlertClick(alert)}  
                    passHref  
                  >  
                    <button   
                        style={{backgroundColor: '#720072', fontSize: '12px', width: '55px', height: '2rem'}}   
                        className="rounded-lg text-white duration-300 hover:opacity-90"  
                    >   
                        <FormattedMessage id="alertType" />   
                    </button>  
                  </Link>  
                  <button   
                      style={{backgroundColor: '#720072', fontSize: '12px', width: '55px', height: '2rem', paddingLeft: '4px', paddingRight: '4px'}}   
                      className="ml-2 rounded-lg text-white duration-300 hover:opacity-90"   
                      onClick={() => handleDeleteClick(alert)}  
                  >   
                      <FormattedMessage id="delete" />   
                  </button>  
                </td>  
              </tr>  
            ))}  
          </tbody>  
        </table>  
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
        {alerts && alerts.map((alert, index) => (
          <div
              className="rounded-lg p-3 shadow-[0_0_12px_rgba(0,0,0,0.12)]"
              key={alert.id}
          >
            <div className="grid grid-cols-[repeat(2,auto)] items-center gap-5">  
              <div>  
                <p className="text-[11px] font-semibold tracking-[-0.2px]">  
                  <FormattedMessage id="#" />  
                </p>  
                <span className="mt-2.5 text-xs">  
                  <button>{index+1}</button>  
                </span>  
              </div>   
              <div>  
                <p className="text-[11px] font-semibold tracking-[-0.2px]">  
                  <FormattedMessage id="companyName" />  
                </p>  
                <span className="mt-2.5 text-xs">  
                  <button>{displayGroupNameOrNA(alert)}</button>  
                </span>  
              </div>    
            </div>  

            <hr className="my-2.5 border-t border-black/20" />  

            <div className="grid grid-cols-2 items-center gap-5">  
              <div>  
                <p className="text-[11px] font-semibold tracking-[-0.2px]">  
                  <FormattedMessage id="authorizedDomains" />  
                </p>  
                <span className="mt-2.5 text-xs">  
                  <button>{alert.domain_name}</button>  
                </span>  
              </div>  
              <div className="col-span-1 grid">  
                <p className="text-center  text-[11px] tracking-[-0.2px]">  
                    <FormattedMessage id="adminEmail" />  
                </p>  
                <span className="mt-2.5 text-center text-xs">  
                  <button>{alert.owner_email}</button>  
                </span>  
              </div>  
            </div>  
            <hr className="my-2.5 border-t border-black/20" />  
            <div className="flex w-full items-center justify-between gap-5">  
              <p className="text-center text-[11px] tracking-[-0.2px]">  
                  <FormattedMessage id="actions" />  
              </p>  

              <div className="flex items-center">  
                <Link href={routes.alertType} passHref>
                  <button   
                      style={{backgroundColor:'#720072', fontSize: '8px', width: '45px', height: '1.5rem', paddingLeft: '4px', paddingRight: '4px'}}   
                      className="rounded-lg text-white duration-300 hover:opacity-90"   
                  >   
                      <FormattedMessage id="alertType" />   
                  </button>  
                </Link>
                <button   
                  style={{backgroundColor: '#720072', fontSize: '8px', width: '45px', height: '1.5rem', paddingLeft: '4px', paddingRight: '4px'}}   
                  className="ml-2 rounded-lg text-white duration-300 hover:opacity-90"   
                  onClick={() => handleDeleteClick(alert)}  
                >   
                  <FormattedMessage id="delete" />   
                </button>  
              </div>  
            </div>  
            
          </div>
        ))}
        </div>
      </div>  

      {isDeleteVisible && selectedAlert && (   
        <DeleteDialog  
          entityId={selectedAlert.id}  
          entityName={displayGroupNameOrNA(selectedAlert)}  
          entityType="alert"  
          onClose={handleDeleteClose}  
          onDelete={handleDeleteSuccess}  
        />  
      )}  
    </>  
  );  
};  

export default AlertManagementTable;


