import * as React from "react";
import {
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function replace(name, params) {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}

export function reset(routes, index) {
  try {
    navigationRef.current?.reset({
      index,
      routes,
    });
  } catch (err) {
    console.error("Navigation Reset Error:", err);
  }
}
export function goBack() {
  if (navigationRef.current?.canGoBack()) {
    navigationRef.current.goBack();
  }
}
