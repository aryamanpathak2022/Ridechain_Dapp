import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Redirect,router,Link } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import {images} from '../constants';
// import router from '@/router';

export default function App() {
    return (
        <View style={styles.container}>
            {/* <Image
                source={require('/home/hemang/Desktop/Aryaman/RideChain/Attempt/assets/images/maps.png')} // Replace with your image path
                style={styles.logo}
            /> */}
            <Image source={images.map} style={styles.logo} />
            <Text style={[styles.title]}>RideChain </Text>
            <Text style={styles.subtitle}>Your One Stop  <Text style={styles.additional}>Destination</Text></Text>
            <StatusBar style="auto" />
            {/* <Link href="/home" style={styles.link}>Go To Home </Link>
            <Link href="/carList" style={styles.link}>Go To Car List</Link> */}
            <CustomButton
            title ="Continue With Phone Number"
            handlePress={()=> router.push('/sign-in')}
            containerStyles="w-full mt-7"
            />
            <CustomButton
            title ="Register Yourself"
            handlePress={()=> router.push('/sign-up')}
            containerStyles="w-full mt-7"
            />
            <Link href="/home" style={styles.link}>Go To Home </Link>
            <Link href="/carList" style={styles.link}>Go To Car List</Link>
            <Link href="/loader" style={styles.link}>Go To Loader</Link>
            <Link href="/extras/rideGoing" style={styles.link}>Go to Ride Going</Link>
        <StatusBar backgroundColor='#161622' style='dark'/>
        </View>
     
    );
}
// touchable opacity


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#b0d4f1', // Light blue background
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontFamily: 'Poppins-Black',
        marginBottom: 10,
        color: '#274472', // Match the background darkness
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333', // Adjust color as needed
    },
    additional: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#174472', // Match the background darkness
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    link: {
        color: 'blue',
        marginTop: 20,
    },
});