import React, { createContext, useContext, useState } from "react";

// Define the shape of the AuthContext
type AuthContextType = {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  setIsSignedIn: () => {},
});

  const logout = async () => {
    await AsyncStorage.clear();
    setIsSignedIn(false);
    setUserRole(null);
    router.replace("../screens/auth"); // or your login screen
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context in components
export const useAuth = () => useContext(AuthContext);
