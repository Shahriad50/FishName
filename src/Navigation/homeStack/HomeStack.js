import HomeScreen from '../../tab/hometab/homescreens/HomeScreen'
import CustomNavigation from '../../components/CustomNavigation/CustomNavigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack=createNativeStackNavigator();
export const HomeStack = () => {
   
    return (
      <Stack.Navigator screenOptions={{
        header: CustomNavigation
       }}
       >
         <Stack.Screen name="HomeScreen" component={HomeScreen}/>
      </Stack.Navigator>
    )
}

export default HomeStack