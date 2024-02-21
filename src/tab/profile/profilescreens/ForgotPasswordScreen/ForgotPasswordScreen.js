import React from 'react';
import {View, Text, StyleSheet,ScrollView } from 'react-native';
import CustomInput from '../../../../components/CustomInput';
import CustomButton from '../../../../components/CustomButton';
import {useNavigation} from '@react-navigation/core';
const ForgotPasswordScreen=()=>{
  const navigation = useNavigation();
    const onSendPressed=()=>{
      navigation.navigate('NewPassword');
    }
    const onSignInPress=()=>{
      navigation.navigate('SignInScreen');
    }
    return(
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
          <Text style={styles.title}>Reset your password</Text>
  
          <CustomInput
            name="username"
            placeholder="Username"
            
          />
  
          <CustomButton text="Send" onPress={onSendPressed} />
  
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
export default ForgotPasswordScreen
