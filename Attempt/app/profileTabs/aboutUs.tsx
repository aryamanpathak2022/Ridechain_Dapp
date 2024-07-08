import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useFonts } from 'expo-font';
import images from '../../constants/images'; // Adjust the path as needed

const AboutUs = () => {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainHeader}>Welcome to RideChain</Text>
        <Image source={images.map} style={styles.introImage} />
      </View>

      <View style={styles.section}>
        <View style={styles.textContainer}>
          <Text style={styles.subHeader}>About RideChain</Text>
          <Text style={styles.paragraph}>
            RideChain is a revolutionary ride-sharing app that leverages blockchain technology to ensure secure, transparent, and efficient rides. Our platform connects riders and drivers in a decentralized manner, eliminating intermediaries and reducing costs. At RideChain, we prioritize your safety, privacy, and satisfaction, providing you with a seamless and trustworthy ride experience.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Image source={images.features} style={styles.subImageLarge} />
        <View style={styles.textContainer}>
          <Text style={styles.subHeader}>Key Features</Text>
          <Text style={styles.subSubHeader}>Security</Text>
          <Text style={styles.paragraph}>
            State-of-the-art blockchain technology ensures all transactions are secure and tamper-proof.
          </Text>
          <Text style={styles.subSubHeader}>Efficiency</Text>
          <Text style={styles.paragraph}>
            Direct connections between riders and drivers reduce wait times and costs.
          </Text>
          <Text style={styles.subSubHeader}>Transparency</Text>
          <Text style={styles.paragraph}>
            All ride details are recorded on the blockchain for complete transparency.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.textContainer}>
          <Text style={styles.subHeader}>User Testimonials</Text>
          <Text style={styles.paragraph}>
            "RideChain has transformed my daily commute. The transparency and security give me peace of mind." - Hemang Seth
            - Our avid user since 2024
            {"\n"}
            "As a driver, I appreciate the fair distribution of earnings without hidden fees." - Aryaman Pathak
            - Our driver since 2024
          </Text>
        </View>
        <View style={styles.userImages}>
          <View style={styles.imageRow}>
            <Image source={images.users} style={styles.userImage} />
            <Image source={images.driver} style={styles.userImage} />
          </View>
          <Image source={images.taxi} style={styles.taxiImage} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.textContainer}>
          <Text style={styles.subHeader}>Terms and Conditions</Text>
          <View style={styles.paragraph}>
            <Text style={styles.listItem}>• All users must adhere to local laws and regulations while using the service.</Text>
            <Text style={styles.listItem}>• RideChain is not responsible for any personal belongings lost during rides.</Text>
            <Text style={styles.listItem}>• Any disputes between riders and drivers should be resolved through our in-app support system.</Text>
            <Text style={styles.listItem}>• Users must respect each other and maintain a courteous demeanor during all interactions.</Text>
            <Text style={styles.listItem}>• RideChain reserves the right to suspend or terminate accounts that violate these terms.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 0,
  },
  introImage: {
    width: 70,
    height: 90,
    marginTop: 10,
    marginBottom: 10,
  },
  subImageLarge: {
    width: 240,
    height: 240,
    marginBottom: 10,
    alignSelf: 'center',
  },
  mainHeader: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  subHeader: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subSubHeader: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginTop: 10,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
    textAlign: 'center',
  },
  listItem: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
    textAlign: 'left',
    marginLeft: 10,
  },
  userImages: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  userImage: {
    width: 150,
    height: 150,
    // borderRadius: 60,
    marginHorizontal: 5,
  },
  taxiImage: {
    width: 310,
    height: 190,
    marginTop: 0,
  },
});

export default AboutUs;
