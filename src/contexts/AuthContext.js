import React, { createContext, useContext, useCallback } from "react";
import { useDispatch } from "react-redux";
import { isSignedIn, signOutUser } from "../services/authService";
import { clearUserData } from "../redux/reducers/AuthSlice";
import { setLogoutHandler } from "../config/apiClient";
import { useNavigation } from "@react-navigation/native";
import { reset } from "../navigation/RootNavigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const logoutUser = useCallback(async () => {
    try {
      dispatch(clearUserData());
      if (isSignedIn()) {
        signOutUser();
      }
      reset(
        [
          {
            name: "Splash",
          },
        ],
        0
      );
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  React.useEffect(() => {
    setLogoutHandler(logoutUser);
  }, [logoutUser]);

  return (
    <AuthContext.Provider value={{ logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
