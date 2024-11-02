import React, { createContext, useContext, useState, ReactNode } from 'react';    

interface AlertContextType {  
  selectedAlert: Alert | null;  
  setSelectedAlert: (alert: Alert) => void;  
}  

const AlertContext = createContext<AlertContextType | undefined>(undefined);  

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {  
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);  

  return (  
    <AlertContext.Provider value={{ selectedAlert, setSelectedAlert }}>  
      {children}  
    </AlertContext.Provider>  
  );  
};  

export const useAlertContext = () => {  
  const context = useContext(AlertContext);  
  if (context === undefined) {  
    throw new Error('useAlertContext must be used within an AlertProvider');  
  }  
  return context;  
};