import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import { router, Link } from 'expo-router';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        dateOfBirth: '',
        userType: 'USER',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleUserTypeChange = (value) => {
        setForm({ ...form, userType: value });
    };

    const submit = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('https://ride-chain.vercel.app/api/otp/generate', {
                phone: form.phoneNumber,
                email: form.email,
                date: form.dateOfBirth,
                address: 'some address', // Adjust as needed
                fullname: form.name,
                userType: form.userType,
            });
            console.log(response.data);

            if (response.status === 200 || response.status === 201) {
                // Save phone number to local storage
                await AsyncStorage.setItem('phoneNumber', form.phoneNumber);
                console.log('Phone number saved to local storage.');

                // Navigate to OTP screen
                console.log("OTP SENT");
                router.push('/otp');
            } else {
                console.error('Error:', response.data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.innerContainer}>
                    <Image
                        source={images.map}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Enter The RideChain</Text>
                </View>
                <View style={styles.formContainer}>
                    <FormField
                        title="Name"
                        value={form.name}
                        handleChangeText={(text) => setForm({ ...form, name: text })}
                        otherStyles={styles.formField}
                    />
                    <FormField
                        title="Registered Phone Number"
                        value={form.phoneNumber}
                        handleChangeText={(text) => setForm({ ...form, phoneNumber: text })}
                        otherStyles={styles.formField}
                        keyboardType="phone-pad"
                    />
                    <FormField
                        title="Date Of Birth"
                        value={form.dateOfBirth}
                        handleChangeText={(text) => setForm({ ...form, dateOfBirth: text })}
                        otherStyles={styles.formField}
                        keyboardType="numeric"
                    />
                    <FormField
                        title="Registered Email"
                        value={form.email}
                        handleChangeText={(text) => setForm({ ...form, email: text })}
                        otherStyles={styles.formField}
                        keyboardType="email-address"
                    />
                    <View style={styles.radioContainer}>
                        <Text style={styles.radioLabel}>Are you a:</Text>
                        <View style={styles.radioButtons}>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="user"
                                    status={form.userType === 'USER' ? 'checked' : 'unchecked'}
                                    onPress={() => handleUserTypeChange('USER')}
                                />
                                <Text>User</Text>
                            </View>
                            <View style={styles.radioButton}>
                                <RadioButton
                                    value="driver"
                                    status={form.userType === 'DRIVER' ? 'checked' : 'unchecked'}
                                    onPress={() => handleUserTypeChange('DRIVER')}
                                />
                                <Text>Driver</Text>
                            </View>
                        </View>
                    </View>
                    <CustomButton
                        title="Sign-up"
                        handlePress={submit}
                        containerStyles={styles.button}
                        isLoading={isLoading}
                    />
                    <View style={styles.linkContainer}>
                        <Text style={styles.linkText}>
                            Have an account already?
                        </Text>
                        <TouchableOpacity style={styles.link}>
                            <Text style={styles.link}>
                                <Link href={'/sign-in'}>
                                    Sign-in
                                </Link>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    scrollView: {
        flexGrow: 1,
        paddingHorizontal: 17,
        paddingTop: 10,
        paddingBottom: 100,
    },
    innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '15%',
        marginBottom: 9,
    },
    logo: {
        width: 49,
        height: 38,
    },
    title: {
        fontSize: 24,
        color: '#333',
        fontWeight: '600',
        marginTop: 10,
        fontFamily: 'Poppins-SemiBold',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 10,
    },
    formField: {
        marginVertical: 10,
    },
    button: {
        marginTop: 30,
        marginBottom: 30,
    },
    linkContainer: {
        justifyContent: 'center',
        paddingTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    link: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 6,
    },
    radioContainer: {
        marginVertical: 10,
    },
    radioLabel: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 4,
    },
    radioButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
});

export default SignUp;
