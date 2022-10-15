import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export const LoginContext = React.createContext(false);
export const LoginSetContext = React.createContext((b: boolean) => {});

export const LoginManager: React.FC<Props> = ({ children }) => {
  const [is_login, setLogin] = useState<boolean>(false);

  React.useEffect(() => {
    console.log("is_login is changed to " + is_login);
  }, [is_login]);

  const setLoginInfo = (bool: boolean) => {
    setLogin(bool);
  };

  return (
    <LoginSetContext.Provider value={setLoginInfo}>
      <LoginContext.Provider value={is_login}>{children}</LoginContext.Provider>
    </LoginSetContext.Provider>
  );
};
