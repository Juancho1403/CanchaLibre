import React, { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

const AppContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUser(decodificar(token));
    }
  }, []);
  
  return (
    <AppContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
}
export default UserProvider;

export const useAppContext = () => {
  const appContext = useContext(AppContext);

  if (appContext === undefined) {
    throw Error("AppContext tiene que estar definido en APP.JSX");
  }

  return appContext;
};

export function decodificar(token) {
  const decoded = jwt_decode(token);
  return decoded;
}
