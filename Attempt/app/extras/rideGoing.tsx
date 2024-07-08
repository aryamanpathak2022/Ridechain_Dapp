import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { ethers, providers } from 'ethers';
import { abi, contractAddress } from '../../config'; // Adjust the path as needed
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RideGoing = () => {
  const navigation = useNavigation();
  const { open, isConnected, address, provider } = useWalletConnectModal();

  const completeRide = async () => {
    try {
      const rideId = await AsyncStorage.getItem('rideId');
      if (!rideId) {
        console.error('No rideId found in local storage');
        return;
      }
      

      // Connect to Ethereum provider
   
      // @ts-ignore
      const etherprovider = new ethers.providers.Web3Provider(provider);
      const signer = etherprovider.getSigner();
      const rideContract = new ethers.Contract(contractAddress, abi, signer);

      // Call completeRide function
      const tx = await rideContract.completeRide(rideId);
      await tx.wait();

      // Route to /home
      router.replace('/extras/destination');
    } catch (error) {
      console.error('Error completing the ride:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          source={require('../../assets/videos/car_loading.json')} // Adjust the path as needed
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
      <CustomButton
        title="Arrived At Your Destination"
        containerStyles="w-full mt-6 "
        handlePress={completeRide}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 500,
    height: 400,
    alignSelf: 'stretch',
  },
  button: {
    marginTop: 20,
    paddingLeft: 10,
    marginLeft: 10,
    width: '80%', // Increase width as needed
    paddingVertical: 15, // Adjust padding for better button size
    backgroundColor: 'blue', // Adjust color as needed
    alignItems: 'center',
    borderRadius: 4,
  },
});

export default RideGoing;
