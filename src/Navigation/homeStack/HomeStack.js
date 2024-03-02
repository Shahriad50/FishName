import HomeScreen from '../../tab/home/homescreens/HomeScreen'
import CustomHeader from '../../components/CustomHeader/CustomHeader'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack=createNativeStackNavigator();
export const HomeStack = () => {
   
    return (
      <Stack.Navigator  >
         <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    )
}

export default HomeStack