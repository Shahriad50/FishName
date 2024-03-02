import React, { useState } from 'react';
import { ScrollView ,View, Text, TextInput, TouchableOpacity, Image, Button,StyleSheet } from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

 const CreatePostScreen = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const options = {
    saveToPhotos:true,
    mediaType: 'photo',
    quality: 1,
  };
  const pickImage = async () => {
    const result=await launchImageLibrary(options);
    if (result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    // to do logic to upload the post data
    console.log('Image:', image);
    console.log('Caption:', caption);
    // to do adding logic to send post data to  backend or storage
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
        style={style.captionInput}
      />
      <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center' }}>
        {image ? (
          <Image source={{ uri: image }} style={style.imagePreview} />
        ) : (
          <View style={style.openCamera}>
            <Icon name="camera" size={40} color="#333" />
            <Text>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <Button title="Post" onPress={handlePost} disabled={!image || !caption} />
    </ScrollView>
  );
 }
 const style=StyleSheet.create({
  captionInput:{

    marginVertical: 16, 
    padding: 8, 
    borderWidth: 1, 
    borderRadius: 8 ,
  },
  openCamera:{
     width: 200,
       height: 200,
       backgroundColor: '#eee',
     justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 8 
  
 },
 imagePreview:{
  marginVertical:20,
  width: 200, 
  height: 200, 
  borderRadius: 8 
 }
}
 )
 export default CreatePostScreen