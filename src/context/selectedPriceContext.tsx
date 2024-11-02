import React, { createContext, useContext, useState, ReactNode } from 'react';  

type SelectedValueContextType = {  
  selectedPlan: string;  
  setSelectedPlan: (plan: string) => void;  
};  

const SelectedValueContext = createContext<SelectedValueContextType | undefined>(undefined);  

export function PlanProvider({ children }: { children: ReactNode }) {  
  const [selectedPlan, setSelectedPlan] = useState<string>("Essentials"); // default value  

  return (  
    <SelectedValueContext.Provider value={{ selectedPlan, setSelectedPlan }}>  
      {children}  
    </SelectedValueContext.Provider>  
  );  
}  

export function useSelectedValue() {  
  const context = useContext(SelectedValueContext);  
  if (!context) {  
    throw new Error('useSelectedValue must be used within a SelectedValueProvider');  
  }  
  return context;  
}