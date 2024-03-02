import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileStack from './src/Navigation/profileStack/ProfileStack'
import HomeStack from './src/Navigation/homeStack/HomeStack'
import ImageStack from './src/Navigation/imageStack/ImageStack'
import CreatePostStack from './src/Navigation/createPostStack/CreatePostStack'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AuthProvider } from './AuthContext';


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
          iconName = 'user' 
           size = focused ? 25 : 20;
        }
        else if (route.name === 'Upload') {
          iconName = 'camera' 
           size = focused ? 25 : 20;
        }
        else if(route.name==='AddPost'){
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
        <Tab.Screen name="AddPost" component={CreatePostStack} />
        <Tab.Screen name="User" component={ProfileStack} />
       
      </Tab.Navigator>
  )
}
const App = () => {
  return(
    <AuthProvider>
      <NavigationContainer>  
        <TabNavigator/>
      </NavigationContainer>
    </AuthProvider>
  )
}

export default App