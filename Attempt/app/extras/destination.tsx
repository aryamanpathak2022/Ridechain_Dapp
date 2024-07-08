import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

const Arrived = () => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false, // set to false for text shadow animations
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false, // set to false for text shadow animations
        }),
      ])
    ).start();
  }, [glowAnim]);

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']
  });

  const animatedStyle = {
    textShadowColor: glowInterpolation,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, animatedStyle]}>
        Arrived
      </Animated.Text>
      <CustomButton
        title="Go To Home"
        handlePress={() => router.push('../(tabs)/home')}
        containerStyles="w-full mt-6 "/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Adjust background color as needed
  },
  text: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Arrived;
