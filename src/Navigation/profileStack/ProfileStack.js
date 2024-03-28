
import SignInScreens from '../../tab/profile/profilescreens/SignInScreens'
import SignUpScreens from '../../tab/profile/profilescreens/SignUpScreens'
import UserDetails from '../../tab/profile/profilescreens/UserDetails'
import ForgotPasswordScreen from '../../tab/profile/profilescreens/ForgotPasswordScreen'
import ConfirmationScreens from '../../tab/profile/profilescreens/ConfirmationScreens'
import NewPasswordScreen from '../../tab/profile/profilescreens/NewPasswordScreen'
import EditProfileScreen from '../../tab/profile/profilescreens/EditProfile/EditProfileScreen'
import LocationScreen from '../../tab/profile/profilescreens/Location/LocationScreen'
import { useAuth } from '../../../AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomNavigation from '../../components/CustomNavigation/CustomNavigation'
const Stack=createNativeStackNavigator();


export const ProfileStack = () => {
    const { user } = useAuth();
    const initialRoute = user ? 'UserDetails' : 'SignInScreen';
    
    return (
      <Stack.Navigator initialRouteName={initialRoute}  screenOptions={{
        header: CustomNavigation
       }}
       >
        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{ headerTitle: 'UserDetails' }}
        />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreens}
          options={{ headerTitle: 'SignInScreens' }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreens}
          options={{ headerTitle: 'SignUpScreens' }}
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
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
         
        />
        <Stack.Screen
          name="LocationScreen"
          component={LocationScreen}
         
        />
      </Stack.Navigator>
    );
  };

  export default ProfileStack
  
  