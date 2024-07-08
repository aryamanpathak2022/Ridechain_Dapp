import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';


const LoadingScreen = () => {
  const [rideStatus, setRideStatus] = useState(null);
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'), // Adjust the path as needed
  });

  const opacity = useRef(new Animated.Value(0)).current;
  const textOpacities = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const fetchRideStatus = async () => {
      console.log("hello");
      try {
        const token = await AsyncStorage.getItem('token'); // Replace 'yourTokenKey' with your actual key
        const response = await axios.post('https://ride-chain.vercel.app/api/ride/currentRide', { token });
        const { ride } = response.data;
        setRideStatus(ride.status);
        if (ride.status === 'ACCEPTED') {
          
          router.replace('/extras/rideGoing'); // Replace 'NextPage' with your actual next page route
        }
      } catch (error) {
        console.error('Error fetching ride status:', error);
      }
    };

    const interval = setInterval(fetchRideStatus, 3000);

    return () => clearInterval(interval);
  }, [navigation]);

  useEffect(() => {
    const opacityAnimation = Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    });

    const textAnimations = textOpacities.map((textOpacity, index) =>
      Animated.sequence([
        Animated.delay(index * 1000), // Delay each text line
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.sequence([
      opacityAnimation,
      Animated.loop(
        Animated.sequence([
          textAnimations[0],
          textAnimations[1],
          textAnimations[2],
          textAnimations[3],
        ])
      ),
    ]).start();
  }, [opacity, textOpacities]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topAnimationContainer}>
        <LottieView
          source={require('../assets/videos/car_loading.json')} // Adjust the path as needed
          autoPlay
          loop
          style={styles.map}
        />
      </View>
      <Animated.View style={[styles.textContainer, { opacity }]}>
        <Animated.Text style={[styles.text, { opacity: textOpacities[0] }]}>
          Finding Your Ride
        </Animated.Text>
        <Animated.Text style={[styles.text, { opacity: textOpacities[1] }]}>
          This May Take Some Time
        </Animated.Text>
        <Animated.Text style={[styles.text, { opacity: textOpacities[2] }]}>
          Our Servers Are Running
        </Animated.Text>
        <Animated.Text style={[styles.text, { opacity: textOpacities[3] }]}>
          They Are Finding The Best Ride For You
        </Animated.Text>
      </Animated.View>
      <View style={styles.bottomAnimationContainer}>
        {/* Additional content can go here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white', // Light blue background color
    paddingVertical: 40, // Add padding to adjust the spacing
  },
  topAnimationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomAnimationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: 500,
    height: 400,
    alignSelf: 'stretch',
  },
  animation: {
    width: 800,
    height: 200,
  },
  textContainer: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  text: {
    fontSize: 24,
    color: 'black', // Darker blue text color to match the light blue theme
    fontFamily: 'Poppins-Bold', // Ensure you have the correct font loaded
    textAlign: 'center', // Center the text
  },
});

export default LoadingScreen;
