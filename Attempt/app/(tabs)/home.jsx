import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { ethers } from 'ethers';
import { contractAddress, abi } from "../../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';



const MAP_BOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXJ5YW1hbjMyMSIsImEiOiJjbHk1cjA4ZHUwMmtsMnZyMWpkd3BmdW56In0.A_pE1P5o-XKKaTX1PBKJXQ'; // replace with your actual token
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

const App = () => {
  const [userType, setUserType] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [pickupResultList, setPickupResultList] = useState([]);
  const [dropoffResultList, setDropoffResultList] = useState([]);
  const [pickupText, setPickupText] = useState('');
  const [dropoffText, setDropoffText] = useState('');
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [contractResponse, setContractResponse] = useState(null);
  const [pendingTx, setPendingTx] = useState(null);
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [rides, setRides] = useState([]);
  const [rideId, setRideId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const jwttoken = await AsyncStorage.getItem('token');
        if (jwttoken) {
          const response = await axios.post('http://ride-chain.vercel.app/api/user', { jwttoken });
          console.log('User info:', response.data.user);
          setUserType(response.data.user.userType);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserType();

    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('Oops, this will not work on Snack in an Android Emulator. Try it on your device!');
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const searchItems = async (text, setResultList) => {
    try {
      if (text.length > 2) {
        let response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?` +
          new URLSearchParams({
            access_token: MAP_BOX_ACCESS_TOKEN,
            limit: 5,
            language: 'en',
            country: 'IND',
          })
        );
        let result = await response.json();
        setResultList(result.features);
      } else {
        setResultList([]);
      }
    } catch (error) {
      console.log('Error fetching search results:', error);
      setResultList([]);
    }
  };

  const onPressListItem = (item, setCoordinates, setInputText, setResultList) => {
    const [longitude, latitude] = item.geometry.coordinates;
    setCoordinates({ latitude, longitude });
    setInputText(item.place_name);
    setResultList([]);
  };

  const setPickupToCurrentLocation = async () => {
    if (location) {
      setPickupCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
  
      try {
        let response = await fetch(
          `https://api.mapbox.com/search/geocode/v6/reverse?` +
          new URLSearchParams({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
            geometries: 'geojson',
            access_token: MAP_BOX_ACCESS_TOKEN,
          })
        );
  
        if (response.ok) {
          let data = await response.json();
          
          // Extract the full addresses
          let addresses = data.features.map(feature => feature.full_address);
          
          // Log the full addresses or set them to your state
          console.log(addresses);
          setPickupText(addresses);
          setPickupResultList([]);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
  };
  
  
  

  useEffect(() => {
    const fetchRoute = async () => {
      if (pickupCoordinates && dropoffCoordinates) {
        try {
          let response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates.longitude},${pickupCoordinates.latitude};${dropoffCoordinates.longitude},${dropoffCoordinates.latitude}?` +
            new URLSearchParams({
              geometries: 'geojson',
              access_token: MAP_BOX_ACCESS_TOKEN,
            })
          );
          let data = await response.json();
          let coordinates = data.routes[0].geometry.coordinates.map(coord => ({
            latitude: coord[1],
            longitude: coord[0],
          }));
          setRouteCoordinates(coordinates);
        } catch (error) {
          console.log('Error fetching route:', error);
        }
      }
    };

    fetchRoute();
  }, [pickupCoordinates, dropoffCoordinates]);

  const handleButtonPress = async () => {
    if (isConnected) {
        return provider?.disconnect();
    }
    return open();
};

const updateBackend = async (rideId) =>
{
  const token = await AsyncStorage.getItem('token');
    console.log(rideId);
    // store rideId in async storgae
    await AsyncStorage.setItem('rideId', rideId);
      const response = await fetch('https://ride-chain.vercel.app/api/ride/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token,
          rideId: parseInt(rideId),
          pickup: pickupText,
          drop: dropoffText,
          price: '0', // Replace with actual price if available
          duration: '0', // Replace with actual duration if available
          driverId: 0
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Backend response:', data);
        router.replace('/loader');
      } else {
        console.error('Backend error:', data);
      }

};

const interactWithContract = async () => {
  setContractResponse(null);
  
  if (isConnected && pickupText && dropoffText) {
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    if (pendingTx) {
      Alert.alert("Pending Transaction", "Please wait for the pending transaction to be confirmed.");
      return;
    }

    try {
      // Send transaction to request ride
      const transaction = await contract.requestRide(pickupText, dropoffText);
      setPendingTx(transaction.hash);

      // Wait for transaction receipt
      const receipt = await transaction.wait();
      setPendingTx(null);

      // Get the current value of rideCounter
      const rideCounter = await contract.rideCounter();
      console.log("Ride counter:", rideCounter);
      console.log('Current Ride Counter:', rideCounter.toString());
      setRideId(rideCounter.toString());
      setContractResponse('Ride requested successfully');

      // Update backend with rideCounter if needed
      updateBackend(rideCounter.toString());
      
    } catch (error) {
      console.error('Error interacting with contract:', error);
      setContractResponse('Error requesting ride');
    }
  } else {
    setContractResponse('Connect your wallet and provide pickup and dropoff locations');
  }
};






  
  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{errorMsg}</Text>
      </View>
    );
  }

  if (userType === null) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Pick-up Location"
          onChangeText={text => {
            setPickupText(text);
            searchItems(text, setPickupResultList);
          }}
          value={pickupText}
        />
        <TouchableOpacity style={styles.iconButton} onPress={setPickupToCurrentLocation}>
          <Text style={styles.iconButtonText}>Set Current Location</Text>
        </TouchableOpacity>
      </View>
      {pickupText && pickupResultList.length > 0 && (
        <FlatList
          data={pickupResultList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => onPressListItem(item, setPickupCoordinates, setPickupText, setPickupResultList)}
            >
              <Text style={styles.itemText}>{item.place_name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Drop-off Location"
          onChangeText={text => {
            setDropoffText(text);
            searchItems(text, setDropoffResultList);
          }}
          value={dropoffText}
        />
      </View>
      {dropoffText && dropoffResultList.length > 0 && (
        <FlatList
          data={dropoffResultList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => onPressListItem(item, setDropoffCoordinates, setDropoffText, setDropoffResultList)}
            >
              <Text style={styles.itemText}>{item.place_name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleButtonPress} style={styles.button}>
          {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
        </Button>
        <Button mode="contained" onPress={interactWithContract} style={styles.button}>
          Request Ride
        </Button>
      </View>
      <Text style={styles.contractResponse}>
        {address}
      </Text>
      <Text style={styles.contractResponse}>
        {pendingTx ? `Pending Transaction: ${pendingTx}` : contractResponse}
      </Text>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {pickupCoordinates && (
            <Marker coordinate={pickupCoordinates} pinColor="blue" />
          )}
          {dropoffCoordinates && (
            <Marker coordinate={dropoffCoordinates} pinColor="red" />
          )}
          {routeCoordinates.length > 0 && (
            <Polyline coordinates={routeCoordinates} strokeColor="blue" strokeWidth={3} />
          )}
        </MapView>
      )}
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    backgroundColor: '#fff',
  },
  iconButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  iconButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    width: '45%',
    borderRadius: 8,
  },
  contractResponse: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  map: {
    height: Dimensions.get('window').height / 2,
    marginTop: 16,
    borderRadius: 8,
  },
});

export default App;

