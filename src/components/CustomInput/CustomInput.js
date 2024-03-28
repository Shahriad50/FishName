import React, { useState, useEffect } from 'react';
import { View, TextInput, Text,StyleSheet,TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
const CustomInput = ({ placeholder, value, setValue, secureTextEntry, checkAvailability }) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    // Checking unique username availability when the value changes
    if (checkAvailability) {
      checkAvailability(value);
    }
    
  }, [value, checkAvailability]);

  return (
    <View style={[styles.container,{marginVertical:10}]}>
      <TextInput
       
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
      {!isAvailable && <Text style={{ color: 'red' }}>Username is not available</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',

    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {},
});


export default CustomInput