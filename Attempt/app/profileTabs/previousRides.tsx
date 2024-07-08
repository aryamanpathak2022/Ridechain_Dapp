import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '../../constants';

const PreviousRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.post('http:/ride-chain.vercel.app/api/ride/previousRides', {token
          });
          console.log(response.data)
          setRides(response.data.rides);
        }
      } catch (error) {
        console.error('Error fetching rides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rides}
        renderItem={({ item }) => (
          <View style={styles.rideBox}>
            <Text style={styles.rideInfo}>Duration: {item.duration} min </Text>
            <Text style={styles.rideInfo}>Amount: ₹{item.price}</Text>
            <Text style={styles.rideInfo}>Pick Up Point: {item.pickupLoc}</Text>
            <Text style={styles.rideInfo}>Destination: {item.dropoffLoc}</Text>
            <Text style={styles.rideInfo}>Status: {item.status}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  rideBox: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  rideType: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  rideInfo: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#555',
    marginTop: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginVertical: 5,
  },
});

export default PreviousRides;
