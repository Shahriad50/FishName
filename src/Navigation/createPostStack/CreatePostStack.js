import CreatePostScreen from '../../tab/createPostScreen/CreatePostScreen'
import CustomNavigation from '../../components/CustomNavigation/CustomNavigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack=createNativeStackNavigator();
export const CreatePostStack=()=>{
    return (
    <Stack.Navigator   screenOptions={{
      header: CustomNavigation
     }}
     >
      <Stack.Screen name={"CreatePostScreen"} component={CreatePostScreen}/>
      </Stack.Navigator>
    )
  }
  
export default CreatePostStack