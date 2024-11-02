
import React, { createContext, useContext, useState, ReactNode } from 'react';  

interface SearchContextType {  
  searchValue: string;  
  setSearchValue: (value: string) => void;  
}  

const SearchContext = createContext<SearchContextType | undefined>(undefined);  

export const SearchProvider = ({ children }: { children: ReactNode }) => {  
  const [searchValue, setSearchValue] = useState<string>('');  

  return (  
    <SearchContext.Provider value={{ searchValue, setSearchValue }}>  
      {children}  
    </SearchContext.Provider>  
  );  
};  

export const useSearch = () => {  
  const context = useContext(SearchContext);  
  if (!context) {  
    throw new Error('useSearch must be used within a SearchProvider');  
  }  
  return context;  
};