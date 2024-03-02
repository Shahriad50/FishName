import imageUploader from '../../tab/imageUpload/imageUploader'
import CustomHeader from '../../components/CustomHeader/CustomHeader'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack=createNativeStackNavigator();

export const ImageStack=()=>{
    return(
      <Stack.Navigator>
      <Stack.Screen name={"imageUploader"} component={imageUploader} />
      </Stack.Navigator>
    )
  }

export default ImageStack