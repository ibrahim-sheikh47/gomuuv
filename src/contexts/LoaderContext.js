// contexts/LoaderContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { loaderRef } from "./LoaderRef";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Important: bind ref once when provider mounts
  useEffect(() => {
    loaderRef.show = () => setLoading(true);
    loaderRef.hide = () => setLoading(false);
  }, []);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
