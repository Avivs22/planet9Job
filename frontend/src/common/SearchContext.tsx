import React, { createContext, useContext, useState } from 'react';

// Define the context shape
interface SearchContextType {
  value: string;
  setValue: (url: string) => void;
  file: File | undefined;
  setFile: (file: File|undefined) => void;
  globalUrls: string[] | undefined;
  setGlobalUrls: (urls: string[]|undefined) => void;
  
}

// Create the context with a default value
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Create a provider component
export const SearchProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [value, setValue] = useState('');

  const [file, setFile] = useState<File|undefined>(undefined);
  const [globalUrls, setGlobalUrls] = useState<string[]| undefined>([]);


  return (
    <SearchContext.Provider value={{ value, setValue,file, setFile,globalUrls, setGlobalUrls }}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook for consuming context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
