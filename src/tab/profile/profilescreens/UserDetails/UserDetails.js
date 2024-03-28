import React, { useState, useEffect ,useRef} from 'react';
import { View, StatusBar, SafeAreaView, Text, StyleSheet, ScrollView, Image, useWindowDimensions, TouchableOpacity, Dimensions, Linking,Alert, ActivityIndicator,Button } from 'react-native';
import CustomButton from '../../../../components/CustomButton';
import { useNavigation } from '@react-navigation/core';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../../AuthContext';
import {WebView} from 'react-native-webview';
const UserDetails = ({ route }) => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const refs=useRef();
  const { user } = useAuth();
  const [userData, setUserData] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const onSignInPressed = () => {
    navigation.navigate('SignInScreen');
  };

  const signOut = async() => {
    try {
      await auth().signOut();

      console.log('User signed out!');
      navigation.navigate('SignInScreen');
    } catch (error) {
      console.log(error.nativeMessage);
    }
  };
  const fetchUserData = async () => {
    try {
      const authUid = auth().currentUser.uid;
      console.log(authUid)
      // Fetch the user document using the Firebase Authentication UID
      const userDoc = await firestore().collection('users').where('uid', '==', authUid).get();
  
      if (!userDoc.empty) {
        // If the user document exists, retrieve the first document (there should be only one)
        const userData = userDoc.docs[0].data();
        setUserData(userData);
      } else {
        Alert.alert('Error:', 'User document does not exist');
      }
    } catch (error) {
      Alert.alert('Error:', `Error fetching user data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('fetching user data...')
    {
      // If user information is not available, fetch it from Firestore
      fetchUserData(user.uid);
    }
  }, []);
  onEditProfile=()=>{
    navigation.navigate('EditProfileScreen');
  }
  onLocation=()=>{
    navigation.navigate('LocationScreen');
  }
  
  return (
    <ScrollView>
      
      <View style={styles.detailsView}>
        {/* Loading indicator while fetching data */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
        <View style={styles.profileImageContainer}>
      <Image
  source={{ uri: userData?.profileImageUri }}
  style={[styles. profileImage]}
  resizeMode="contain"
/>
</View>
        <Text style={styles.personalInfo}>Email: {userData?.email} </Text>
        <Text style={styles.personalInfo}>Username: {userData?.username}</Text>
        <Text style={styles.personalInfo}>Full Name: {userData?.fullname}</Text>
      </View>

      

      

      {/* Sign-in button if the user is not logged in */}
      {!auth().currentUser && (
        <CustomButton onPress={onSignInPressed} text="Log In" />
      )}

      {/* Sign-out button if the user is logged in */}
      {auth().currentUser && (
       <View style={styles.buttonView}>
         <Button onPress={onEditProfile} title="Edit Details" color="green" />
         <Button onPress={signOut} title="Log Out" color="red" />
       </View>
         )}
    
  <View style={styles.videoContainer}>
          <Text style={styles.subHeading}>About FishName App</Text>
          <WebView
            style={styles.video}
            javaScriptEnabled={true}
            source={{ uri: "https://www.youtube.com/embed/25d8i4LMCnw?si=obPH4n2or4bejPNr" }}
          />
        </View>
        <View style={styles. ButtonArea}> 
        <Button style={styles.Button} onPress={onLocation} title="Location" color="green" />
        </View>
         
    </ScrollView>
  );
      }

const styles = StyleSheet.create({
  detailsView: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 30,
    marginVertical: 10,
    fontSize: 20,
    fontWeight: '200',
  },
  personalInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
    borderRadius: 2,
    borderColor: '#e832',
    borderWidth: 2,
    marginVertical: 10,
  },
  profileImageContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Half of the width and height for a circular shape
    borderColor: 'gray', // Optional border color
    borderWidth: 2, // Optional border width
  },
 buttonView: {
  
  flexDirection: 'row', 
  justifyContent: 'space-between', 
 
   padding: 10
  },
  videoContainer: {
    marginBottom: 20,
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#28a745'
  },
  video: {
    height: 200,
    width: Dimensions.get('window').width - 40,
  },
  mapContainer: {
    flex:1
  },
  map: {
    height: 200,
    borderRadius: 10,
  },
  Webview: {
    flex: 2,
    
  },
  ButtonArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  Button: {
    width: 80,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'black',
    alignItems: 'center'
  },
  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
  
});

export default UserDetails;

