import { createContext, useState } from "react";

export const BaseContext = createContext();

const BaseProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return <BaseContext.Provider value={{ loading, setLoading }}>{children}</BaseContext.Provider>;
};

export default BaseProvider;
