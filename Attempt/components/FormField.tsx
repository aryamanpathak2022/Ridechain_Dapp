import { View, Text, TextInput, StyleSheet } from 'react-native';
import React from 'react';

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
  return (
    <View style={[styles.fieldContainer, otherStyles]}>
      <Text style={styles.label}>{title}</Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={handleChangeText}
        style={styles.input}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 15, // Adjust as needed to decrease the distance between fields
  },
  label: {
    fontSize: 16,
    color: '#333', // Adjust the color as needed
    fontFamily: 'Poppins-Medium', // Ensure you have the correct font loaded
    marginBottom: 5, // Adjust as needed to decrease the distance
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: '#fff', // Adjust the background color as needed
    fontFamily: 'Poppins-Regular', // Ensure you have the correct font loaded
  },
});

export default FormField;
