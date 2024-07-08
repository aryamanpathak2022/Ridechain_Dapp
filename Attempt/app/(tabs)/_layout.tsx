import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const storedUserType = await AsyncStorage.getItem('userType');
        setUserType(storedUserType);
      } catch (error) {
        console.error('Failed to fetch user type from AsyncStorage', error);
      }
    };

    fetchUserType();
  }, []);

  if (userType === null) {
    // Optionally, render a loading indicator while the user type is being fetched
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#2c82c9',
          tabBarInactiveTintColor: '#b0d4f1',
          tabBarStyle: {
            backgroundColor: '#F0F4F8',
            borderTopWidth: 0, // Remove the border by setting width to 0
            borderTopColor: 'transparent', // Optional: Ensure no color is applied
            height: 64,
          },
        }}
      >
        {userType === 'USER' && (
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}
          />
        )}
        {userType === 'DRIVER' && (
          <Tabs.Screen
            name="driver"
            options={{
              title: "Driver",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Driver"
                  focused={focused}
                />
              ),
            }}
          />
        )}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
