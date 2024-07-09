import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.65}
      style={[styles.button, containerStyles, isLoading && styles.disabled]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black', // replace with your secondary color
    borderRadius: 15,
    minHeight: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF', // replace with your primary text color
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;
