import React, { useState } from "react";

type LoginContextType = {
  is_login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
};
type Props = {
  children: React.ReactNode;
};

export const LoginContext = React.createContext({} as LoginContextType);

export const LoginManager: React.FC<Props> = ({ children }) => {
  const [is_login, setLogin] = useState<boolean>(false);

  const value = {
    is_login,
    setLogin,
  };

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};
