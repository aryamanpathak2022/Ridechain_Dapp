import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import CustomButton from '../../components/CustomButton';
import emailjs from 'emailjs-com';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [complaint, setComplaint] = useState('');

  const handleSubmit = () => {
    // Replace with your actual Email.js credentials
    emailjs.send('service_k5slt8x', 'template_eneenfl', {
      from_name: name,
      from_email: email,
      phone_number: phoneNumber,
      message: message,
      complaint: complaint,
    }, 'YOUR_USER_ID')
      .then((response) => {
        console.log('Email successfully sent!', response);
        // Optionally, add code to handle successful submission (e.g., show a success message)
      })
      .catch((error) => {
        console.error('Email failed to send:', error);
        // Optionally, add code to handle errors (e.g., show an error message)
      });

    // Clear form fields after submission
    setName('');
    setEmail('');
    setPhoneNumber('');
    setMessage('');
    setComplaint('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Your Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Feedback or Complaint (optional)"
        value={complaint}
        onChangeText={setComplaint}
        multiline
      />
      {/* Custom Button Component */}
      <CustomButton title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  messageInput: {
    height: 120,
  },
});

export default ContactUs;