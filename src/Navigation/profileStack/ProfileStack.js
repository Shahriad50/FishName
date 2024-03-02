
import SignInScreens from '../../tab/profile/profilescreens/SignInScreens'
import SignUpScreens from '../../tab/profile/profilescreens/SignUpScreens'
import UserDetails from '../../tab/profile/profilescreens/UserDetails'
import ForgotPasswordScreen from '../../tab/profile/profilescreens/ForgotPasswordScreen'
import ConfirmationScreens from '../../tab/profile/profilescreens/ConfirmationScreens'
import NewPasswordScreen from '../../tab/profile/profilescreens/NewPasswordScreen'
import { useAuth } from '../../../AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomHeader from '../../components/CustomHeader/CustomHeader'
const Stack=createNativeStackNavigator();


export const ProfileStack = () => {
    const { user } = useAuth();
    const initialRoute = user ? 'UserDetails' : 'SignInScreen';
    
    return (
      <Stack.Navigator initialRouteName={initialRoute}
       >
        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          
        />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreens}
         
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreens}
          
        />
        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreens}
         
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          
        />
        <Stack.Screen
          name="Newpassword"
          component={NewPasswordScreen}
         
        />
      </Stack.Navigator>
    );
  };

  export default ProfileStack
  
  