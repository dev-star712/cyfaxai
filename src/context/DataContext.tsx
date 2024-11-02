// DataContext.tsx  
import React, { createContext, useState, useContext, ReactNode } from 'react';  

interface DataContextProps {  
  data: any;  
  setData: (data: any) => void;  
}  

const DataContext = createContext<DataContextProps>({  
  data: null,  
  setData: () => {},  
});  

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {  
  const [data, setData] = useState<any>(null);  

  return (  
    <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>  
  );  
};  

export const useDataContext = () => useContext(DataContext);