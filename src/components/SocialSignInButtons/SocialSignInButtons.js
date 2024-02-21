import React from 'react';
import {View, Text,Alert} from 'react-native';
import CustomButton from '../CustomButton';
import auth from '@react-native-firebase/auth';
import { useNavigation} from '@react-navigation/core';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
const SocialSignInButtons = () => {
  const navigation = useNavigation();
  const onSignInFacebook = () => {
    console.warn('onSignInFacebook');
  };

  const onSignInGoogle = async() => {
    try {
      // Check if  device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  
      // Get the users ID token
      const { idToken, user } = await GoogleSignin.signIn();
      console.log(user);
      Alert.alert('Success:', 'Logged in using Google');
  
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      const loggedInUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name:userCredential.user.name,
      };
      console.log({loggedInUser:loggedInUser});
      await firestore().collection('users').doc(userCredential.user.uid).set({
        uid:userCredential.user.uid,
        fullname: user.name,
        email: user.email,
        username: user.givenName,
        profileImageUri: user.photo
      });
      // Navigate to UserDetails screen with user credentials
      navigation.navigate('UserDetails', { user: loggedInUser });
  
    } catch (error) {
      console.error('Error signing in with Google:', error);
      Alert.alert('Error:', `Failed to sign in with Google: ${error.message}`);
    }
  };

  const onSignInApple = () => {
    console.warn('onSignInApple');
  };

  return (
    <>
      <CustomButton
        text="Sign In with Facebook"
        onPress={onSignInFacebook}
        bgColor="#E7EAF4"
        fgColor="#4765A9"
      />
      <CustomButton
        text="Sign In with Google"
        onPress={onSignInGoogle}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
      />
      <CustomButton
        text="Sign In with Apple"
        onPress={onSignInApple}
        bgColor="#e3e3e3"
        fgColor="#363636"
      />
    </>
  );
};

export default SocialSignInButtons;