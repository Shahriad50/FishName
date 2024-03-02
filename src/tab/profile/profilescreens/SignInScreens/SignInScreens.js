import React, { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ScrollView, StyleSheet, Image, useWindowDimensions, Alert } from 'react-native';
import CustomInput from '../../../../components/CustomInput';
import CustomButton from '../../../../components/CustomButton';
import SocialSignInButtons from '../../../../components/SocialSignInButtons';
import fishlogo from '../../../../../assets/images/logo_2.png';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword, auth } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const SignInScreens = ({route}) => {
  const { height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  
  const onSignInPressed = async () => {
    try {
      const authInstance = getAuth();
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;
  
      // Check if the email is verified
      if (user && user.emailVerified) {
        const serializedUser = {
          uid: user.uid,
          email: user.email,
          // Add other necessary properties
        };
        try {
          await AsyncStorage.setItem('userData', JSON.stringify(serializedUser));
        } catch (error) {
          console.error('Error saving user data:', error);
        }
        navigation.navigate('UserDetails', { user: serializedUser }); // Passing user information to UserDetails screen
      } else {
        Alert.alert('Error:', 'Please verify your email before signing in.');
      }
    } catch (error) {
      // Handle other errors
      Alert.alert('Error:', error.message);
    }
  };
  

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  useEffect(()=>{
    GoogleSignin.configure({
      webClientId: '918877351004-6phc64afpu009dcqvmdpfht1mudd5pf5.apps.googleusercontent.com',
    });
  },[])

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={fishlogo}
          style={[styles.logo, { height: height * 0.15 }]}
          resizeMode="contain"
        />
        <CustomInput placeholder={'email'} value={email} setValue={setEmail} />
        <CustomInput
          placeholder={'password'}
          value={password}
          setValue={setPassword}
          secureTextEntry
        />

        <CustomButton onPress={onSignInPressed} text="SignIn" />
        <CustomButton
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
          text="Forgot your password"
        />
        <SocialSignInButtons />

        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
});

export default SignInScreens;
