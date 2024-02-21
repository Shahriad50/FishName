import React, { useState } from 'react';
import { ScrollView ,View, Text, TextInput, TouchableOpacity, Image, Button } from 'react-native';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker';
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
    // Implement logic to upload the post data
    console.log('Image:', image);
    console.log('Caption:', caption);
    // Add logic to send post data to your backend or storage
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center' }}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 8 }} />
        ) : (
          <View style={{ width: 200, height: 200, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
            <Icon name="camera" size={40} color="#333" />
            <Text>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
        style={{ marginVertical: 16, padding: 8, borderWidth: 1, borderRadius: 8 }}
      />
      <Button title="Post" onPress={handlePost} disabled={!image || !caption} />
    </ScrollView>
  );
 }