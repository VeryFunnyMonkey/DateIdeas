// Custom hook to use the AuthContext.
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export const useAuthContext = () => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error("useAuthContext must be used within an AuthProvider");
    }
  
    return context;
  };
  