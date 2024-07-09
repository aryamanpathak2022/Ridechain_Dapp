import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import { useRouter, Link } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PhoneInput from "react-native-phone-number-input";


const SignIn = () => {
  const [form, setForm] = useState({ phoneNumber: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const phoneInputRef = useRef(null); // Create a ref for PhoneInput
  const router = useRouter();

  const handlePress = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://ride-chain.vercel.app/api/otp/generate', {
        phone: form.phoneNumber,
      });

      if (response.status === 200 || response.status === 201) {
        await AsyncStorage.setItem('phoneNumber', form.phoneNumber);
        router.push('/otp');
      } else {
        Alert.alert('Error', 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.innerContainer}>
          <Image
            source={images.map}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome Back</Text>
        </View>
        <View style={styles.formContainer}>
          <PhoneInput
            ref={phoneInputRef} // Assign the ref to PhoneInput
            defaultValue={value}
            defaultCode="IN"
            layout="first"
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => setForm({ ...form, phoneNumber: text })}
            withDarkTheme
            withShadow
            autoFocus
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.phoneInputText}
          />
          <CustomButton
            title="Log-in"
            handlePress={handlePress}
            containerStyles={styles.buttonContainer}
            isLoading={isLoading}
          />
          <View style={styles.signUpLink}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <Link
              href="/sign-up"
              className="text-lg font-semibold"
              style={styles.signUpLinkText}
            >
              Sign-up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '17%',
    marginBottom: 1,
  },
  logo: {
    width: 49,
    height: 38,
  },
  title: {
    fontSize: 34,
    color: '#333',
    fontWeight: '900',
    marginTop: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  phoneInputContainer: {
    width: '100%',
    marginVertical: 10,
    height:"10%"
  },
  phoneInputText: {
    paddingVertical: 0,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  signUpLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
  signUpLinkText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 5,
  },
});

export default SignIn;
