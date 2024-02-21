import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import CustomInput from '../../../../components/CustomInput';
import CustomButton from '../../../../components/CustomButton';
import {useNavigation} from '@react-navigation/core';
import auth from '@react-native-firebase/auth';
const ConfirmationScreens = ({route}) => {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');

  const navigation = useNavigation();

  const onConfirmPressed = async() => {
    try {
      const credential = auth.EmailAuthProvider.credential(email, verificationCode);
      await auth().currentUser.reauthenticateWithCredential(credential);

      // Mark email as verified
      await auth().currentUser.reload();
      const user = auth().currentUser;

      if (user && user.emailVerified) {
        console.log('Email is verified');
        // Alert.alert('Success:',`Your email ${email} has been verified`)
        navigation.navigate('SignIn',{email,password});
      } else {
        console.log('Email verification failed');
      }
    } catch (error) {
      console.error('Error verifying code:', error.message);
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignInScreen');
  };

  const onResendPress = async () => {
    const user = auth().currentUser;
         if (user) {
        await user.sendEmailVerification();
        console.log('Verification email sent');
        navigation.navigate('ConfirmationScreens', { email, password });
      }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Confirm your email</Text>

        <CustomInput
          name="email"
          value={email}
          setValue={setEmail}
          placeholder="Email"
          rules={{
            required: 'email is required',
          }}
        />

        <CustomInput
          name="code"
          value={verificationCode}
         setValue={setVerificationCode}
          placeholder="Enter your confirmation code"
          rules={{
            required: 'Confirmation code is required',
          }}
        />

        <CustomButton text="Confirm" onPress={onConfirmPressed} />

        <CustomButton
          text="Resend code"
          onPress={onResendPress}
          type="SECONDARY"
        />

        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPress}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default ConfirmationScreens;