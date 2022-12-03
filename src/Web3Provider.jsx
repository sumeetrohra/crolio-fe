import React, { createContext, useState, useEffect } from "react";

export const ProviderContext = createContext();

const Web3Provider = (props) => {
  const [provider, setProvider] = useState();
  const [eoa, setEoa] = useState("");

  useEffect(() => {
    const handleProvider = async () => {
      if (provider) {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setEoa(address);
      }
    };
    handleProvider();
  }, [provider]);

  return (
    <ProviderContext.Provider value={{ provider, setProvider, eoa }}>
      {props.children}
    </ProviderContext.Provider>
  );
};

export default Web3Provider;
