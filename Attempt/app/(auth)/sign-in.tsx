import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import { useRouter, Link } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SignIn = () => {
  const [form, setForm] = useState({
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
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
          <Text style={styles.title}>Log-in to RideChain</Text>
        </View>
        <View style={styles.formContainer}>
          <FormField
            title="Phone Number"
            value={form.phoneNumber}
            handleChangeText={(text) => setForm({ ...form, phoneNumber: text })}
            otherStyles={styles.formField}
            keyboardType="phone-pad"
          />
          <CustomButton
            title="Log-in"
            handlePress={handlePress}
            containerStyles="w-full mt-7"
            isLoading={isLoading}
          />
          <View style={styles.signUpLink}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
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
    backgroundColor: '#F0F4F8', // Replace with your primary background color
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '17%', // Adjust as needed to reduce space
    marginBottom: 1, // Reduce the bottom margin to decrease the distance
  },
  logo: {
    width: 49,
    height: 38,
  },
  title: {
    fontSize: 24,
    color: '#333', // Adjust the color as needed
    fontWeight: '600',
    marginTop: 20,
    fontFamily: 'Poppins-SemiBold', // Ensure you have the correct font loaded
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Adjust as needed
    paddingTop: 10, // Reduce the top padding to decrease the distance
  },
  formField: {
    marginTop: 10, // Reduce the top margin to decrease the distance
  },
  signUpLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#333', // Adjust the color as needed
    fontFamily: 'Poppins-Medium', // Ensure you have the correct font loaded
  },
  signUpLinkText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold', // Ensure you have the correct font loaded
    marginLeft: 5,
  },
});

export default SignIn;
