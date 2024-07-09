import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Redirect,router,Link } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import {images} from '../constants';
// import router from '@/router';

export default function App() {
    
    return (
        <View style={styles.container}>
            <Image source={images.map} style={styles.logo} />
            <Text style={styles.title}>RideChain</Text>
            <Text style={styles.subtitle}>Your One Stop <Text style={styles.additional}>Destination</Text></Text>
            <StatusBar style="auto" />
            <CustomButton
                title="Log In"
                handlePress={() => router.push('/sign-in')}
                containerStyles={styles.button}
            />
            <CustomButton
                title="Sign Up"
                handlePress={() => router.push('/sign-up')}
                containerStyles={styles.button}
            />
            <StatusBar backgroundColor='#161622' style='dark' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white', // Light blue background
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontFamily: 'Poppins-Black',
        marginBottom: 10,
        color: 'black', // Darker blue
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
        marginBottom: 20,
        color: 'grey', // Adjust color as needed
    },
    additional: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#174472', // Match the background darkness
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    button: {
        width: '50%',
        marginTop: 15,
        marginBottom:20,
    },
});