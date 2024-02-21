import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native'
import React from 'react'
import SignInScreens from '../tab/profile/profilescreens/SignInScreens'
import SignUpScreens from '../tab/profile/profilescreens/SignUpScreens'
import ForgotPasswordScreen from '../tab/profile/profilescreens/ForgotPasswordScreen'
import ConfirmationScreens from '../tab/profile/profilescreens/ConfirmationScreens'
import NewPasswordScreen from '../tab/profile/profilescreens/NewPasswordScreen'

const Stack=createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={"SignInScreen"} component={SignInScreens}/>
        <Stack.Screen name={"SignUp"} component={SignUpScreens}/>
        <Stack.Screen name={"Confirmation"} component={ConfirmationScreens}/>
        <Stack.Screen name={"ForgotPassword"} component={ForgotPasswordScreen}/>      
        <Stack.Screen name={"Newpassword"} component={NewPasswordScreen}/>
    </Stack.Navigator> 
    </NavigationContainer>

  )
}

export default Navigation