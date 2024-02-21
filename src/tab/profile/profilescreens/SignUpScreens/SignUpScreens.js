import React,{useState, useRef,useEffect}from 'react';
import {View, Text, StyleSheet, ScrollView,Image,useWindowDimensions,TouchableOpacity,Platform} from 'react-native';
import CustomInput from '../../../../components/CustomInput';
import CustomButton from '../../../../components/CustomButton';
import CustomDatepicker from '../../../../components/customDatepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/core';
import { getAuth, createUserWithEmailAndPassword ,sendEmailVerification,updateProfile} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PhoneInput from "react-native-phone-number-input";
import { collection, addDoc } from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
const SignUpScreen = () => {
  const { height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [fullName, setFullName] = useState('');
  const navigation = useNavigation();
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [profileImageUri, setProfileImageUri] = useState(null);
  const phoneInput = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios'); // On iOS, the DateTimePicker is controlled, so we hide it after selection
    if (date) {
      setSelectedDate(date);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };
 
  const checkUsernameAvailability = async (newUsername) => {
    try {
      const usernameSnapshot = await firestore()
        .collection('users')
        .where('username', '==', newUsername)
        .get();

      const available = usernameSnapshot.empty;
      setIsUsernameAvailable(available);
    } catch (error) {
      console.error('Error checking username availability:', error);
      setIsUsernameAvailable(false);
    }
  };
  const options = {
    saveToPhotos:true,
    mediaType: 'photo',
    quality: 1,
  };
  const pickImage = async() => {
    const result=await launchImageLibrary(options);
    if (result.assets.length > 0) {
      setProfileImageUri(result.assets[0].uri);
    }
    else{
      console.log('Something went wrong')
    }
  };
  const onRegisterPressed = async () => {
    try {
      // Check if passwords match
      if (password !== repeatPassword) {
        console.error('Passwords do not match');
        return;
      }
  
      const auth = getAuth();
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const user = userCredential.user;
  
      try {
        // Add user details to Firestore
        const userDocRef = await addDoc(collection(firestore(), 'users'), {
          uid: user.uid,  // Use the Firebase Authentication UID
          email: email,
          username: username,
          fullname: fullName,
          mobile: formattedValue,
          profileImageUri: profileImageUri,
        });
  
        if (userDocRef) {
          // Send verification email
          await sendEmailVerification(user);
  
          console.log('Verification email sent');
        }
  
        // Update user profile with username
        await updateProfile(user, {
          displayName: username,
        });
  
        console.log('User added to Firestore!');
      } catch (error) {
        console.error('Error adding user to Firestore:', error);
      }
  
      console.log('User signed up:', user);
  
      // Redirect to Email Verification screen
      navigation.navigate('SignInScreen');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
  
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
  
      console.error('Error creating user:', error);
    }
  };
  const onSignInPress = () => {
    navigation.navigate('SignInScreen');
  };

  const onTermsOfUsePressed = () => {
    console.warn('onTermsOfUsePressed');
  };

  const onPrivacyPressed = () => {
    console.warn('onPrivacyPressed');
  };

  useEffect(() => {
    console.log('ImageUri set:', profileImageUri);
  }, [profileImageUri]);



  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
      

        {profileImageUri ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: profileImageUri }}
              style={styles.previewImage}
            />
          </View>
        ) : (
          <View style={styles.previewContainer}>
        <TouchableOpacity onPress={pickImage}>
        <View style={styles.previewPlaceholder}>
            <Icon name="user" size={50} color="#ccc"  style={styles.usericon}/>
        </View>
         </TouchableOpacity>
        </View>
        )}
        <Text style={styles.title}>Create an account</Text>

        <CustomInput
          name="name"
          placeholder="Full Name"
          setValue={setFullName}
          value={fullName}
          required
        />

<CustomInput
          placeholder="Username"
          value={username}
          setValue={setUsername}
          checkAvailability={checkUsernameAvailability}
        />
        {!isUsernameAvailable && (
          <Text style={{ color: 'red' }}>Username is not available. Please choose another one.</Text>
        )}
        <CustomInput
          name="email"
          placeholder="Email"
          setValue={setEmail}
          value={email}
          required
        />
        <CustomInput
          name="password"
          placeholder="Password"
          setValue={setPassword}
           value={password}
          secureTextEntry
          required
        />
        <CustomInput
          name="password-repeat"
          placeholder="Repeat Password"
          setValue={setRepeatPassword}
          value={repeatPassword}
          secureTextEntry
          required
        />
        <View style={styles.dateInput}>
  <TouchableOpacity onPress={showDatePickerModal}>
    {selectedDate ? (
      <Text>{selectedDate.toDateString()}</Text>
    ) : (
      <Text>Enter your Date of birth</Text>
    )}
  </TouchableOpacity>

  {showDatePicker && (
    <DateTimePicker
      value={selectedDate}
      mode="date"
      display="default"
      onChange={handleDateChange}
    />
  )}
</View>
        <PhoneInput
          style={styles.phoneInput}
          name="mobile"
            ref={phoneInput}
            defaultValue={value}
            defaultCode="BD"
            layout="first"
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            withDarkTheme
            withFilter
        filterPlaceholder="Search for BD"
        filterPickerContainerStyle={{ backgroundColor: 'white' }}
        filterInputStyle={{ color: 'black' }}
        filterButtonTextStyle={{ color: 'blue' }}
        filterPlaceholderTextColor="gray"
          />
        <CustomButton
          text="Register"
          onPress={onRegisterPressed}
        />

        <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={onPrivacyPressed}>
            Privacy Policy
          </Text>
        </Text>

       

        <CustomButton
          text="Have an account? Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
  previewContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  previewPlaceholder: {
    position: 'relative',
    width: 50, 
    height: 50,
    borderRadius:50,
    borderColor:'#e23'
  },
  usericon: {
    position: 'absolute',
    top: 0,
    left: 0,
   
  },
  icon: {
    position: 'absolute',
    top: 10,
    left: 10,
    justifyContents:'center',
    alignItems:'center'
  },
  phoneInput:{
    backgroundColor: 'white',
    width: '100%',

    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 5,
  },
  dateInput:{
   
      backgroundColor: 'white',
      width: '100%',
  
      borderColor: '#e8e8e8',
      borderWidth: 1,
      borderRadius: 5,
  
      paddingHorizontal: 10,
      marginVertical: 10,
    },
});

export default SignUpScreen;