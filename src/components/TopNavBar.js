import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TopNavBar = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('TopNavBar: Retrieved Token:', token);
        if (!token) {
          console.log('TopNavBar: No token found, redirecting to Login');
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get(
          'http://localhost:5000/api/account/profile',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('TopNavBar: Profile API Response:', response.data);
        if (response.status === 200 && response.data.imageUrl) {
          const imageUrl = `http://localhost:5000${response.data.imageUrl}`;
          console.log('TopNavBar: Setting Profile Image:', imageUrl);
          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error('TopNavBar: Error fetching profile picture:', error);
        if (error.response && error.response.status === 401) {
          console.log('TopNavBar: Unauthorized, redirecting to Login');
          await AsyncStorage.removeItem('token');
          navigation.navigate('Login');
        }
      }
    };

    fetchProfilePicture();
  }, [navigation]);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.iconButton}>
            <Icon name="bars" size={24} color="#04366D" />
          </TouchableOpacity>
          <Image
            source={require('../assets/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
          <View style={styles.imageContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/user.png')
              }
              style={styles.profileIcon}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: 60 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  logo: {
    width: 38,
    height: 38,
    marginLeft: 8,
  },
  imageContainer: {
    width: 36,
    height: 36,
    borderRadius: 18, // Half of width/height for perfect circle
    overflow: 'hidden', // Ensures image is clipped to circle
  },
  profileIcon: {
    width: '100%',
    height: '100%',
  },
});

export default TopNavBar;