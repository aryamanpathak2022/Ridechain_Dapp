import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import Axios for API requests
import icons from '../../constants/icons'; // Adjust the path as needed
import CustomButton from '@/components/CustomButton'; // Adjust the path as needed
import { useNavigation } from '@react-navigation/native'; // Adjust the path as needed


const UserInfo = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const jwttoken = await AsyncStorage.getItem('token');
        if (jwttoken) {
          const response = await axios.post('http://ride-chain.vercel.app/api/user', { jwttoken });
          console.log('User info:', response.data.user);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('index');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={icons.profile} style={styles.profile} />
        <Text style={styles.name}>{user.fullname}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Image source={icons.email} style={styles.icon} />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user.email}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Image source={icons.phone} style={styles.icon} />
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.info}>{user.phone}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Image source={icons.address} style={styles.icon} />
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.info}>{user.address}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Image source={icons.birth} style={styles.icon} />
          <Text style={styles.label}>DOB:</Text>
          <Text style={styles.info}>{new Date(user.dob).toLocaleDateString()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Image source={icons.car} style={styles.icon} />
          <Text style={styles.label}>Last Ride:</Text>
          <Text style={styles.info}>
            {user.previousRides.map(ride => (
              <Text key={ride.id}>From {ride.pickupLoc} to {ride.dropoffLoc} on {new Date(ride.completeAt).toLocaleDateString()}{'\n'}</Text>
            ))}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Image source={icons.star} style={styles.icon} />
          <Text style={styles.label}>Rating:</Text>
          <Text style={styles.info}>{user.rating}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Comments:</Text>
        {user.comments.map(comment => (
          <View key={comment.id} style={styles.commentContainer}>
            <Text style={styles.commentTitle}>{comment.title}</Text>
            <Text style={styles.commentContent}>{comment.content}</Text>
            <Text style={styles.commentRating}>Rating: {comment.rating}</Text>
          </View>
        ))}
         <CustomButton
            title ="Log Out"
            handlePress={handleLogout}
            containerStyles="w-full mt-7"
            />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profile: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    width: '100%',
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#555',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: 120,
  },
  info: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  commentContainer: {
    marginBottom: 15,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  commentContent: {
    fontSize: 16,
    color: '#333',
  },
  commentRating: {
    fontSize: 16,
    color: '#777',
  },
});

export default UserInfo;
