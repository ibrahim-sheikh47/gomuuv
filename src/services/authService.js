import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from 'expo-apple-authentication';

GoogleSignin.configure({
  webClientId:
    "927173641477-irrkglah24ke9olvq38nr4r7uuq70rlt.apps.googleusercontent.com",
  iosClientId:
    "927173641477-7teeobddmcmo7e2jpk99bjrj9o599mgi.apps.googleusercontent.com",
  offlineAccess: true,
  scopes: [
    "email",
    "profile",
    "https://www.googleapis.com/auth/user.gender.read",
  ],
});

export const isSignedIn = () => {
  const isSignedIn = GoogleSignin.hasPreviousSignIn();
  return isSignedIn;
};

export const googleSignIn = () => {
  return new Promise(async (resolve, reject) => {
    await GoogleSignin.signIn()
      .then(async (res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const signOutUser = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (e) {
    console.log(e);
  }
};

export const appleSignIn = async () => {
  try {
    const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });
    return appleAuthRequestResponse;
  } catch (error) {
    console.log(error);
    if (error.code === 'ERR_REQUEST_CANCELED') {
    } else {
    }
  }
};
