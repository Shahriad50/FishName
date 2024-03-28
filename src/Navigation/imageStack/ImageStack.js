import ImageUpload from '../../tab/imageUpload/ImageUpload'
import CustomNavigation from '../../components/CustomNavigation/CustomNavigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack=createNativeStackNavigator();

export const ImageStack=()=>{
    return(
      <Stack.Navigator  screenOptions={{
        header: CustomNavigation
       }}
       >
      <Stack.Screen name={"ImageUpload"} component={ImageUpload}/>
      </Stack.Navigator>
    )
  }

export default ImageStack