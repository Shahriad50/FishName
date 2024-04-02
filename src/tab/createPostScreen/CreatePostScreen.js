import React, { useState,useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image, Button, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../AuthContext';
import { useNavigation } from '@react-navigation/core';

import WebView from 'react-native-webview';


const CreatePostScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [isVideoLink, setIsVideoLink] = useState(false);
  const options = {
    saveToPhotos: true,
    mediaType: 'photo',
    quality: 1,
  };

  const pickImage = async () => {
    const result = await launchImageLibrary(options);
    if (result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    try {
      const postDetails = await firestore().collection('newsfeed').add({
        uid: user.uid,
        content: caption,
        photo: image,
        videoLink: isVideoLink ? videoLink : null,
      });

      if (postDetails) {
        alert('success', 'Post has been shared');
        setCaption('');
        setImage('');
        setVideoLink('');
        setIsVideoLink(false);
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Check if the caption contains a valid YouTube link
    if (caption.toLowerCase().includes('youtube.com') || caption.toLowerCase().includes('youtube')) {
      setVideoLink(caption);
      setIsVideoLink(true);
    }
  }, [caption]);
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
        style={styles.captionInput}
      />
      {isVideoLink ? (
        <WebView
          source={{ html: `<iframe width="100%" height="auto" src="${videoLink}" frameborder="0" allowfullscreen></iframe>` }}
        />
      ) : (
        <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center' }}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.openCamera}>
              <Icon name="add-a-photo" size={40} color="#333" />
              <Text style={{color:'#333'}}>Add image</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      <Button title="Post" onPress={handlePost}  />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  captionInput: {
    marginVertical: 16,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  openCamera: {
    width: 200,
    height: 200,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  imagePreview: {
    marginVertical: 20,
    width: 200,
    height: 200,
    borderRadius: 8,
  },
});

export default CreatePostScreen;