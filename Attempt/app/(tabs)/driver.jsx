import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Linking } from 'react-native'; // Import Linking from react-native
import { ethers } from 'ethers';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { contractAddress, abi } from "../../config";
import axios from 'axios';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const projectId = "1e17a2872b93b5b42a336585c052e9ff";
const providerMetadata = {
  name: "YOUR_PROJECT_NAME",
  description: "YOUR_PROJECT_DESCRIPTION",
  url: "https://your-project-website.com/",
  icons: ["https://your-project-logo.com/"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};

const DriverApp = () => {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [rideRequests, setRideRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRideRequests = async () => {
    try {
      const response = await axios.get('https://ride-chain.vercel.app/api/ride/availableRides');
      console.log(response.data);
      if (response.data && Array.isArray(response.data)) {
        setRideRequests(response.data);
      } else {
        setRideRequests([]); // Ensure rideRequests is always an array
      }
    } catch (error) {
      console.error('Error fetching ride requests:', error);
      setRideRequests([]); // Ensure rideRequests is always an array
    }
  };

  const setupProvider = useCallback(async () => {
    if (provider) {
      console.log('Provider:', provider);
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const network = await ethersProvider.getNetwork();

      if (network.chainId !== 11155111) { // Sepolia testnet chain ID
        console.error('Incorrect network, please switch to Sepolia testnet.');
        return;
      }

      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      console.log('Signer:', signer);
      console.log('Contract Address:', contractAddress);

      return { contract, signer };
    }
  }, [provider]);

  useEffect(() => {
    fetchRideRequests();
    const interval = setInterval(fetchRideRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRideRequests().finally(() => setRefreshing(false));
  }, []);

  const acceptRide = async (rideId, pickupLoc, dropoffLoc) => {
    const { contract } = await setupProvider();
   
      try {
        const tx = await contract.receiveRide(rideId);
        await tx.wait();
        console.log('Ride accepted:', rideId);

        // Call the backend API to update the ride status in the database
        const token =await AsyncStorage.getItem('token'); // Replace with actual token
        const response = await axios.put('https://ride-chain.vercel.app/api/ride/recieve', {
          token,
          rideId,
        });

        if (response.status === 200) {
          console.log('Backend updated successfully');
        } else {
          console.error('Failed to update backend');
        }

        fetchRideRequests(); // Refresh the ride requests after accepting a ride

        // Open Google Maps with start and drop-off location coordinates
        const startLocation = `${pickupLoc}`;
        const dropoffLocation = `${dropoffLoc}`;
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLocation}&destination=${dropoffLocation}`;
        Linking.openURL(mapsUrl);
      } catch (error) {
        console.error('Error accepting ride:', error);
      }
    
  };

  const handleButtonPress = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Button mode="contained" onPress={handleButtonPress}>
          {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
        </Button>
        <Text> {address}</Text>
        {rideRequests.length > 0 ? (
          rideRequests.map((ride, index) => (
            <View key={index} style={styles.rideRequest}>
              <Text style={styles.rideText}>Ride Requested:</Text>
              <Text style={styles.rideText}>Requester: {ride.requester.fullname}</Text>
              <Text style={styles.rideText}>Pickup Location: {ride.pickupLoc}</Text>
              <Text style={styles.rideText}>Dropoff Location: {ride.dropoffLoc}</Text>
              <Text style={styles.rideText}>Price: {ride.price}</Text>
              <Button mode="contained" onPress={() => acceptRide(ride.rideId, ride.pickupLoc, ride.dropoffLoc)} >
                Accept Ride
              </Button>
            </View>
          ))
        ) : (
          <Text style={styles.noRidesText}>No ride requests yet.</Text>
        )}
        <WalletConnectModal
          projectId={projectId}
          providerMetadata={providerMetadata}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
  },
  rideRequest: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  rideText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  noRidesText: {
    fontSize: 18,
    color: '#888',
  },
});

export default DriverApp;
