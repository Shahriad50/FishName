import CreatePostScreen from '../../tab/createPost/CreatePostScreen'
import CustomHeader from '../../components/CustomHeader/CustomHeader'
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack=createNativeStackNavigator();
export const CreatePostStack=()=>{
    return (
    <Stack.Navigator >
      <Stack.Screen name={"AddPost"} component={CreatePostScreen} />
      </Stack.Navigator>
    )
  }
  
export default CreatePostStack