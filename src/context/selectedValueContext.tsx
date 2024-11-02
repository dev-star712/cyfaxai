import React, { createContext, useContext, useState, ReactNode } from 'react';  

// Extend context with types  
interface SelectedValueContextProps {  
  selectedValue: string;  
  rowType: string;  
  setSelectedValue: (value: string, type: string) => void;  
}  

const SelectedValueContext = createContext<SelectedValueContextProps>({  
  selectedValue: '',  
  rowType: '',  
  setSelectedValue: () => {},  
});  

export const useSelectedValue = () => useContext(SelectedValueContext);  

export const SelectedValueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {  
  const [selectedValue, setSelectedValueState] = useState('');  
  const [rowType, setRowType] = useState('');  

  const setSelectedValue = (value: string, type: string) => {  
    setSelectedValueState(value);  
    setRowType(type);  
  };  

  return (  
    <SelectedValueContext.Provider value={{ selectedValue, rowType, setSelectedValue }}>  
      {children}  
    </SelectedValueContext.Provider>  
  );  
};