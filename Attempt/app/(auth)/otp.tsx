import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Otp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [phoneNumber, setPhoneNumber] = useState('');
  const inputs = useRef([]);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
        if (storedPhoneNumber) {
          setPhoneNumber(storedPhoneNumber);
        }
      } catch (error) {
        console.error('Error fetching phone number from local storage:', error);
      }
    };

    fetchPhoneNumber();
  }, []);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input box
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputs.current[index - 1].focus();
    }
  };

  const submit = async () => {
    const enteredOtp = otp.join('');
    try {
      const response = await axios.post('https://ride-chain.vercel.app/api/otp/verify', {
        phone: phoneNumber,
        otp: enteredOtp,
      });

      if (response.status === 200 || response.status === 201) {
        const token = response.data.token;
        const userType=response.data.userType;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userType', userType);
        console.log('OTP verified. Token saved to local storage.',token);
        router.push('../(tabs)/home');
      } else {
        Alert.alert('Error', 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'OTP verification failed. Please try again.');
    }
  };

  const resendOtp = async () => {
    try {
      const response = await axios.post('https://ride-chain.vercel.app/api/otp/generate', {
        phone: phoneNumber,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'OTP has been resent to your phone number.');
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
      <CustomButton
        title="Submit"
        containerStyles="w-full mt-7"
        handlePress={submit}
        isLoading={false} // Example, set to true if submitting
      />
      <CustomButton
        title="Resend OTP"
        containerStyles="w-full mt-4"
        handlePress={resendOtp}
        isLoading={false} // Example, set to true if resending
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    fontFamily: 'Poppins-SemiBold', // Ensure you have the correct font loaded
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  otpBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins-SemiBold', // Ensure you have the correct font loaded
  },
  button: {
    width: 200, // Increased width
    height: 50, // Increased height
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Otp;
