import { View, Text,SafeAreaView } from 'react-native'
import React,{useEffect,useState} from 'react'
import SignInScreens from './src/tab/profile/profilescreens/SignInScreens'
import SignUpScreens from './src/tab/profile/profilescreens/SignUpScreens'
import UserDetails from './src/tab/profile/profilescreens/UserDetails'
import imageUploader from './src/tab/imageUpload/imageUploader'
import CreatePostScreen from './src/tab/createPost/CreatePostScreen'
import ForgotPasswordScreen from './src/tab/profile/profilescreens/ForgotPasswordScreen'
import ConfirmationScreens from './src/tab/profile/profilescreens/ConfirmationScreens'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Navigation from './src/Navigation'
import NewPasswordScreen from './src/tab/profile/profilescreens/NewPasswordScreen'
import HomeScreen from './src/tab/home/homescreens/HomeScreen'
import { getAuth } from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';


const Tab = createBottomTabNavigator();
const Stack=createNativeStackNavigator();




export const HomeStack = () => {
   
    return (
      <Stack.Navigator screenOptions={{headerShown:false}} >
         <Stack.Screen name="Home" component={HomeScreen} />

      </Stack.Navigator>
    )
}

export const ImageStack=()=>{
  return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name={"imageUploader"} component={imageUploader}/>
    </Stack.Navigator>
  )
}
export const ProfileStack = () => {
  const [initialRoute, setInitialRoute] = useState('SignInScreen');
  useEffect(() => {
    const checkAuthentication = async () => {
      const authInstance = getAuth();
      const user = authInstance.currentUser;

      if (user) {
        setInitialRoute('UserDetails');
      } else {
        setInitialRoute('SignInScreen');
      }
    };

    checkAuthentication();
  }, []);
    return (
      
      <Stack.Navigator initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        
       
      }}>
         <Stack.Screen name={"UserDetails"} component={UserDetails}/>
        <Stack.Screen name={"SignInScreen"} component={SignInScreens}/>
        <Stack.Screen name={"SignUp"} component={SignUpScreens}/>
        <Stack.Screen name={"Confirmation"} component={ConfirmationScreens}/>
        <Stack.Screen name={"ForgotPassword"} component={ForgotPasswordScreen}/>      
        <Stack.Screen name={"Newpassword"} component={NewPasswordScreen}/>
      </Stack.Navigator>
    )
}

export const CreatePostStack=()=>{
  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name={"addPost"} component={CreatePostScreen}/>
    </Stack.Navigator>
}

export const TabNavigator=()=>{
  return (
    <Tab.Navigator  screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName ='home'
          size = focused ? 25 : 20;
        } 
        else if (route.name === 'User') {
          iconName = 'user' 
           size = focused ? 25 : 20;
        }
        else if (route.name === 'Upload') {
          iconName = 'camera' 
           size = focused ? 25 : 20;
        }
        else if(route.name==='addPost'){
          iconName='plus-circle'
          size = focused ? 25 : 20;
        }
        
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: '#55532',
      tabBarShowLabel: true,
      tabBarLabelStyle: { fontSize: 14 },
      tabBarShowIcon: true,
    })} >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Upload" component={ImageStack} />
        <Tab.Screen name="addPost" component={CreatePostStack} />
        <Tab.Screen name="User" component={ProfileStack} />
       
      </Tab.Navigator>
  )
}
const App = () => {

 
  return(
      <NavigationContainer>  
        <TabNavigator/>
      </NavigationContainer>
  )
  

}

export default App