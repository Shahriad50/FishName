import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, FlatList, PermissionsAndroid,Platform } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { encode as btoa } from 'base-64';
import * as tf from "@tensorflow/tfjs";
import {
  bundleResourceIO,
  decodeJpeg,
  fetch,
} from "@tensorflow/tfjs-react-native";

 const modelJson = require("../../../assets/trained_model/model.json");
 import modelWeights from '../../../assets/trained_model/weights.bin';



const CLOUDINARY_CLOUD_NAME="dpai2ojzt"
const CLOUDINARY_API_KEY=244143253923943
const CLOUDINARY_API_SECRET="tT8A4o2SelATUxgpuhMktS6Qhi4"

const transformImageToTensor = async (uri) => {
  //read the image as base64
  const img64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const imgBuffer = tf.util.encodeString(img64, "base64").buffer;
  const raw = new Uint8Array(imgBuffer);
  let imgTensor = decodeJpeg(raw);
  const scalar = tf.scalar(255);
  //resize the image
  imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [224, 224]);
  //normalize; if a normalization layer is in the model, this step can be skipped
  const tensorScaled = imgTensor.div(scalar);
  //final shape of the tensor
  const img = tf.reshape(tensorScaled, [1, 224, 224, 3]);
  return img;
};

const labels=[
' Gold Fish',
'Grass Carp',
 'Silver Carp',
 'Tilapia',
 'Catla'
]
const ImageUploader = () => {
  const [cselectedImage, csetSelectedImage] = useState(null);
  const [fselectedImage, fsetSelectedImage] = useState(null);
  const [recentImages, setRecentImages] = useState([]);
  const [camera, setCameraPhoto] = useState();
  const [prediction, setPrediction] = useState(null);
  const [model, setModel] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const options = {
    saveToPhotos: true,
    mediaType: 'photo',
    quality: 1,
  };

const uploadToCloudinary = async (uri) => {
  if (!uri) {
    console.error('URI is null or undefined.');
    return;
  }
  try {
    const data = new FormData();
    data.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    const cloud_name = CLOUDINARY_CLOUD_NAME;
    const basicAuth = `Basic ${btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`)}`;
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      data,
      {
        withCredentials: false,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': basicAuth,
        },
        params: {
          upload_preset: "uaa0l7fe",
        },
      }
    );
    const result = response.data;
  } catch (error) {
    if (!error.response) {
      console.error('Error occurred before receiving a response from Cloudinary:', error.message);
      return;
    }
    console.log(error.response.data);
    console.error('Error uploading to Cloudinary:', error.message);
  }
};
const fetchRecentUploads = async () => {
  try {
    const cloud_name = CLOUDINARY_CLOUD_NAME;
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${cloud_name}/resources/image`,
      {
        headers: {
          Authorization: `Basic ${btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`)}`,
        },
      }
    );

    return response.data.resources;
  } catch (error) {
    console.error('Error fetching recent uploads from Cloudinary:', error);
    return [];
  }
};
  // This function handles the process of uploading a photo from the camera.
  // It requests permission to access the camera and if granted, it launches the camera to take a photo.
  // After the photo is taken, it uploads the photo to Cloudinary using the uploadToCloudinary function.
  // If the upload is successful, it updates the state with the URI of the uploaded photo.
  const handleCameraUpload = async () => {
    // Request permission to access the camera.
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

    // If permission is granted, launch the camera to take a photo.
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = await launchCamera(options);

      try {
        // Upload the photo to Cloudinary using the uploadToCloudinary function.
        uploadToCloudinary(result.assets[0].uri);

        // Update the state with the URI of the uploaded photo.
        const newRecentImages = [...recentImages, result.assets[0].uri];
        setRecentImages(newRecentImages);
     
      setCameraPhoto(result.assets[0].uri)
      setSelectedImage(result.assets[0].uri);
      } catch (error) {
        // If there's an error during the upload, log the error to the console.
        console.error('Error uploading to Cloudinary:', error);
      }
    }
  }

  const handleFileUpload = async () => {
    const result = await launchImageLibrary(options);
  
    try {
      const uploadedImage = result.assets[0].uri;
      setSelectedImage(result.assets[0].uri);
      // Upload the photo to Cloudinary using the uploadToCloudinary function.
      await uploadToCloudinary(uploadedImage);
  
      // Fetch recent uploads from Cloudinary
      const recentUploads = await fetchRecentUploads();
  
      // Update the state with the retrieved images
      setRecentImages(recentUploads.map(upload => upload.secure_url));
      
      // Set the selected image state
      fsetSelectedImage(uploadedImage);
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  };

const handleImageScan = async () => {
  await tf.ready();
  const model = await tf.loadLayersModel(
    bundleResourceIO(modelJson, modelWeights)
  );
  setModel(model);

  const imageTensor = await transformImageToTensor(selectedImage);
  const predictions = model.predict(imageTensor);
  const highestPredictionIndex = predictions.argMax(1).dataSync();
  const predictedClass = `${labels[highestPredictionIndex]}`;
  console.log(predictedClass);
  setPrediction(predictedClass);
  Alert.alert('Success','You Successfully scan the image');
}
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Camera Upload" />
        <Card.Content>
          <TouchableOpacity onPress={handleCameraUpload}>
            <Text style={styles.uploadText}>Tap to upload picture from camera</Text>
          </TouchableOpacity>
          {cselectedImage && (
            <View style={styles.previewContainer}>
              <Image style={styles.previewImage} source={{ uri: camera }} />
              <Button icon="camera" mode="contained" onPress={handleImageScan}>
                Scan
              </Button>
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
          {fselectedImage && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: fselectedImage }} style={styles.previewImage} />
              <Button icon="camera" mode="contained" onPress={handleImageScan}>
                Scan
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    
    <View style={styles.recentCard}>
      <Text style={styles.uploadText}>Recent Uploads</Text>
      <FlatList
        data={recentImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.previewImage} />
        )}
        horizontal
      />
    </View>
      

    </ScrollView>
  );
};

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
  recentCard:{
    flex:1,
    flexDirection:'column'
  }
});

export default ImageUploader;
