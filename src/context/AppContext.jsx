import { createContext, useState, useContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Generic state for sharing info between components
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  return (
    <AppContext.Provider value={{ 
      loading, setLoading, 
      error, setError,
      candidates, setCandidates,
      jobs, setJobs
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;