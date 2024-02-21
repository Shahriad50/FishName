import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useWindowDimensions, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../../../../components/CustomButton';
import { useNavigation } from '@react-navigation/core';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UserDetails = ({ route }) => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const [userData, setUserData] = useState('');
  const [loading, setLoading] = useState(true);

  const onSignInPressed = () => {
    navigation.navigate('SignInScreen');
  };

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        navigation.navigate('SignInScreen');
      })
      .catch(error => {
        console.log(error.nativemessage);
      });
  };

  const fetchUserData = async (authUid) => {
    try {
     // const authUid = auth().currentUser.uid;
  
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
    // Extract user information from route parameters
    const { user } = route.params || {};
    console.log(user)
    {
      // If user information is not available, fetch it from Firestore
      fetchUserData(user.uid);
    }
  }, []);
  return (
    <ScrollView>
      
      <View style={styles.detailsView}>
        {/* Loading indicator while fetching data */}
      {/* {loading && <ActivityIndicator size="large" color="#0000ff" />} */}
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
        <CustomButton style={{ padding: 20, marginVertical: 20 }} onPress={onSignInPressed} text="Sign In" />
      )}

      {/* Sign-out button if the user is logged in */}
      {auth().currentUser && (
        <CustomButton style={{ padding: 20, marginVertical: 20, backgroundColor: '#3f23' ,color:'red' }} text="Sign Out" onPress={signOut} type="TERTIARY" />
      )}
    </ScrollView>
  );
};

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
  
});

export default UserDetails;
