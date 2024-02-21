// ImageUploader.js
import React, { useState,useEffect } from 'react';
import { View, Text, ScrollView,StyleSheet, TouchableOpacity, Image,FlatList,PermissionsAndroid } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [recentImages, setRecentImages] = useState([]);
 
  const [camera, setCameraPhoto] = useState();
  useEffect(() => {
    
  }, []);
  const options = {
    saveToPhotos:true,
    mediaType: 'photo',
    quality: 1,
  };
  const handleCameraUpload =async () => {
   const granted=await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
   );
   if(granted===PermissionsAndroid.RESULTS.GRANTED){
    const result = await launchCamera(options);
    const newRecentImages = [...recentImages, result.assets[0].uri];
      setRecentImages(newRecentImages);
     
    setCameraPhoto(result.assets[0].uri)
   }
  };

  const handleFileUpload = async() => {
     const result=await launchImageLibrary(options);
     if (result.assets.length > 0) {
      const newRecentImages = [...recentImages, result.assets[0].uri];
      setRecentImages(newRecentImages);
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Camera Upload" />
        <Card.Content>
          <TouchableOpacity onPress={handleCameraUpload}>
            <Text style={styles.uploadText}>Tap to upload picture from camera</Text>
          </TouchableOpacity>
          {selectedImage && (
          <View style={styles.previewContainer}>
          <Image style={styles. previewImage} source={{uri:camera}}/>
          </View>
           )}
        </Card.Content>
      </Card>

      <Divider style={styles.divider} />

      <Card style={styles.card}>
        <Card.Title title="File Upload" />
        <Card.Content>
          <TouchableOpacity onPress={handleFileUpload}>
            <Text style={styles.uploadText}>Tap to upload picture from gallery</Text>
            </TouchableOpacity>
            {selectedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        </View>
      )}
         
        </Card.Content>
      </Card>

      

<Text style={styles.recentText}>Recent Uploads</Text>
      <FlatList
        data={recentImages}
        keyExtractor={(item) => item}
        horizontal
        renderItem={({ item }) => (
          <Card style={styles.recentCard}>
            <Card.Cover source={{ uri: item }} style={styles. previewImage} />
          </Card>
        )}
      />
    </ScrollView>
  );};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginVertical: 8,
  },
  uploadText: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
    padding: 16,
  },
  divider: {
    marginVertical: 16,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default ImageUploader;
