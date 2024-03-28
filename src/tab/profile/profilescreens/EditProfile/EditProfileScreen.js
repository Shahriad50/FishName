import { View, Text, StyleSheet, ScrollView, Image, Alert,TouchableOpacity} from 'react-native';
import React,{useState,useEffect,useRef} from 'react'
import { useAuth } from '../../../../../AuthContext';
import CustomButton from '../../../../components/CustomButton';
import CustomInput from '../../../../components/CustomInput';
import {useNavigation} from '@react-navigation/core';
import firestore from '@react-native-firebase/firestore';
import PhoneInput from "react-native-phone-number-input";
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
// import {BASE_URL,API_KEY} from '@env';

const BASE_URL="https://api.countrystatecity.in/v1"
const API_KEY='Z1FJeDhTS3VYR1FkSnZBUDNPOVF2RnJlaEs5VnNNQlZGOU42RXJBbw=='
const EditProfileScreen = () => {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [userData, setUserData] = useState('');
    const navigation = useNavigation();
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const[validPhone,setValidPhone]=useState(false);
    const [profileImageUri, setProfileImageUri] = useState(null);
    const phoneInput = useRef(null);
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    var config_1 = {
      method: 'get',
      url: `${BASE_URL}/countries`,
      headers: {
        'X-CSCAPI-KEY': API_KEY,
      },
    };

    axios(config_1)
      .then(response => {
       // console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let countryArray = [];
        for (var i = 0; i < count; i++) {
          countryArray.push({
            value: response.data[i].iso2,
            label: response.data[i].name,
          });
        }
        setCountryData(countryArray);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleState = countryCode => {
    var config_1 = {
      method: 'get',
      url: `${BASE_URL}/countries/${countryCode}/states`,
      headers: {
        'X-CSCAPI-KEY': API_KEY,
      },
    };

    axios(config_1)
      .then(function (response) {
       // console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let stateArray = [];
        for (var i = 0; i < count; i++) {
          stateArray.push({
            value: response.data[i].iso2,
            label: response.data[i].name,
          });
        }
        setStateData(stateArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCity = (countryCode, stateCode) => {
    var config_1 = {
      method: 'get',
      url: `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
      headers: {
        'X-CSCAPI-KEY': API_KEY,
      },
    };

    axios(config_1)
      .then(function (response) {
       // console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let cityArray = [];
        for (var i = 0; i < count; i++) {
          cityArray.push({
            value: response.data[i].id,
            label: response.data[i].name,
          });
        }
        setCityData(cityArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios'); // On iOS, the DateTimePicker is controlled, so we hide it after selection
    if (date) {
      setSelectedDate(date);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
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
  useEffect(() => {
    console.log('ImageUri set:', profileImageUri);
  }, [profileImageUri]);
  const fetchUserData = async (authUid) => {
    try {
     // const authUid = auth().currentUser.uid;
  
      // Fetch the user document using the Firebase Authentication UID
      const userDoc = await firestore().collection('users').where('uid', '==', authUid).get();
  
      if (!userDoc.empty) {
        // If the user document exists, retrieve the first document (there should be only one)
        const userData = userDoc.docs[0].data();
        setUserData(userData);
        console.log('ImageUri set:', userData.profileImageUri);
      } else {
        Alert.alert('Error:', 'User document does not exist');
      }
    } catch (error) {
      Alert.alert('Error:', `Error fetching user data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const checkValidPhoneInput=()=>{
    
    axios.get(`https://phonevalidation.abstractapi.com/v1/?api_key=ba5a614d88574766a4fc9d16e0f62176&phone=${formattedValue}`)
        .then(response => {
            console.log(response.data);
            setValidPhone(response.data.valid);
        })
        .catch(error => {
            console.log(error);
        });
  }
  useEffect(() => {
    console.log('fetching user data...')
    {
      // If user information is not available, fetch it from Firestore
      fetchUserData(user.uid);
    }
  }, []);
  onUpdateDetailsPressed = async () => {

    if(formattedValue){
      checkValidPhoneInput();
    }
    try {
      
      await firestore().collection('users').doc(user.uid).update({
        fullname: fullName,
        mobile: validPhone?formattedValue:'',
        profileImageUri: profileImageUri,
      });
      const addressRef = firestore().collection('users').doc(user.uid).collection('address').doc(user.uid);
      if(!addressRef.exists){
        await addressRef.set({
          city: cityName?cityName:"",
          state: stateName?stateName:"",
          country: countryName?countryName:"",
        });
      }
      else{
        await addressRef.update({
          city: cityName,
          state: stateName,
          country: countryName,
        });
      }
      Alert.alert('Success', 'Details and Address updated');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', `Failed to update details and address: ${error.message}`);
    } finally {
      navigation.navigate('UserDetails');
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <View style={styles.previewContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{uri: userData.profileImageUri}}
              style={styles.previewImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.customInputContainer}>
          <Text style={styles.labelText}>Name</Text>
          <CustomInput
            name="name"
            label=""
            placeholder={userData.fullname}
            setValue={setFullName}
            value={fullName}
            required
          />
        </View>
        <View style={styles.customInputContainer}>
          <Text style={styles.labelText}>Date of birth</Text>
          <View style={[styles.customInputContainer,{backgroundColor:'white',height:40,alignItems:'center',justifyContent:'center'}]}>
          <TouchableOpacity onPress={showDatePickerModal}>
            {selectedDate ? (
              <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
            ) : (
              <Text style={styles.dateText}>Enter your Date of birth</Text>
            )}
          </TouchableOpacity>
          </View>
      </View>
      
  
  {showDatePicker && (
    <DateTimePicker
      value={selectedDate}
      mode="date"
      display="default"
      onChange={handleDateChange}
    />
  )}
 
 <View style={styles.customInputContainer}>
<Text style={[styles.addlabel,{color:'blue',marginVertical:10,fontSize:16}]}>Add your location</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={countryData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select country' : '...'}
          searchPlaceholder="Search..."
          value={country}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCountry(item.value);
            handleState(item.value);
            setCountryName(item.label);
            setIsFocus(false);
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={stateData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select state' : '...'}
          searchPlaceholder="Search..."
          value={state}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setState(item.value);
            handleCity(item.value);
            setStateName(item.label);
            setIsFocus(false);
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={cityData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select city' : '...'}
          searchPlaceholder="Search..."
          value={city}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCity(item.value);
            setCityName(item.label);
            setIsFocus(false);
          }}
        />
      </View>
      <View>
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
          </View>
          <View style={{marginTop:10,color:'#000'}}>
        <CustomButton
          text="update details"
          onPress={onUpdateDetailsPressed}
          bgColor={"#443f2f"}
        />
        </View>
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
  customInputContainer:{
   // backgroundColor: 'white',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
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
  dropdown: {
    height: 50,
    width:305,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  // addlabel:{
  //   position: 'absolute',
  //   backgroundColor: 'white',
  //   left: 22,
   
  // },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dateInput:{
   
    backgroundColor: 'white',
    width: '100%',

    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 5,
    },
});

export default EditProfileScreen