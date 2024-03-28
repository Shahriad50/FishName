import CreatePostScreen from '../../tab/createPost/CreatePostScreen'
import CustomNavigation from '../../components/CustomNavigation/CustomNavigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack=createNativeStackNavigator();
export const CreatePostStack=()=>{
    return (
    <Stack.Navigator   screenOptions={{
      header: CustomNavigation
     }}
     >
      <Stack.Screen name={"AddPost"} component={CreatePostScreen}/>
      </Stack.Navigator>
    )
  }
  
export default CreatePostStack