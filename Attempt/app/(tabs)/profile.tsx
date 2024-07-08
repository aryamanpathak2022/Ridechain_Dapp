import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Profile = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity style={styles.tab} onPress={() => router.push('../profileTabs/userInfo')}>
        <Text style={styles.tabText}>Your Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => router.push('../profileTabs/aboutUs')}>
        <Text style={styles.tabText}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => router.push('../profileTabs/contactUs')}>
        <Text style={styles.tabText}>Help and Support</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => router.push('/../profileTabs/previousRides')}>
        <Text style={styles.tabText}>Previous Rides</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    fontFamily: 'Poppins-SemiBold', // Ensure you have the correct font loaded
  },
  tab: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Adds shadow for iOS
    shadowOpacity: 0.1, // Adds shadow for iOS
    shadowRadius: 8, // Adds shadow for iOS
  },
  tabText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins-Medium', // Ensure you have the correct font loaded
  },
});

export default Profile;
