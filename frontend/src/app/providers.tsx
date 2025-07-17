"use client";

import StoreProvider from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import Modal from "react-modal"

const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    Modal.setAppElement("body"); 
  }, []);
  return (
    <StoreProvider>
      <Authenticator.Provider>
        {children}
      </Authenticator.Provider>
    </StoreProvider>
  );
};

export default Providers;
