import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomNavigation from './src/components/CustomNavigation'
import ProfileStack from './src/Navigation/profileStack/ProfileStack'
import HomeStack from './src/Navigation/homeStack/HomeStack'
import ImageStack from './src/Navigation/imageStack/ImageStack'
import CreatePostStack from './src/Navigation/createPostStack/CreatePostStack'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './AuthContext';
import { Provider as PaperProvider } from 'react-native-paper';


const Tab = createBottomTabNavigator();

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
          iconName = 'account-circle' 
           size = focused ? 25 : 20;
        }
        else if (route.name === 'Scanner') {
          iconName = 'image' 
           size = focused ? 35 : 20;
        }
        else if(route.name==='AddPost'){
          iconName='add-box'
          size = focused ? 25 : 20;
        }
       
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#f32e00',
      tabBarInactiveTintColor: '#532',
      tabBarShowLabel: true,
      tabBarStyle: {
        backgroundColor: '#c0c0c0', 
        fontSize:'14px',
        justifyContent:'center'
      },
      tabBarIconContainerStyle: {
        justifyContent: 'center', 
      },
    })} >
        <Tab.Screen name="Home" component={HomeStack} options={{headerShown:false}}/>
        <Tab.Screen name="Scanner" component={ImageStack} options={{headerShown:false}} />
        <Tab.Screen name="AddPost" component={CreatePostStack} options={{headerShown:false}}/>
        <Tab.Screen name="User" component={ProfileStack} options={{headerShown:false}}/>
      </Tab.Navigator>
  )
}


export const App = () => {
  return(
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>  
          <TabNavigator/>
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  )
}

export default App