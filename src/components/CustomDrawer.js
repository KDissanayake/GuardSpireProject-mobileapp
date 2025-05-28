import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CustomDrawer = props => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('CustomDrawer: Retrieved Token:', token);
        if (!token) {
          console.log('CustomDrawer: No token found, redirecting to Login');
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get(
          'http://localhost:5000/api/account/profile',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('CustomDrawer: Profile API Response:', response.data);
        if (response.status === 200 && response.data.imageUrl) {
          const imageUrl = `http://localhost:5000${response.data.imageUrl}`;
          console.log('CustomDrawer: Setting Profile Image:', imageUrl);
          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error('CustomDrawer: Error fetching profile picture:', error);
        if (error.response && error.response.status === 401) {
          console.log('CustomDrawer: Unauthorized, redirecting to Login');
          await AsyncStorage.removeItem('token');
          navigation.navigate('Login');
        }
      }
    };

    fetchProfilePicture();
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => props.navigation.closeDrawer()}
        >
          <Icon name="chevron-circle-right" size={30} color="#04366D" />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/user.png')
              }
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.drawerItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('Dashboard')}
          >
            <Image source={require('../assets/dashblue.png')} style={styles.icon} />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('ManualScanner')}
          >
            <Image
              source={require('../assets/computer-security-shield.png')}
              style={styles.icon}
            />
            <Text style={styles.menuText}>Msg & URL Scanner</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('History')}
          >
            <Image source={require('../assets/document.png')} style={styles.icon} />
            <Text style={styles.menuText}>Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('History')}
          >
            <Image source={require('../assets/history.png')} style={styles.icon} />
            <Text style={styles.menuText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('Settings')}
          >
            <Image source={require('../assets/gearblue.png')} style={styles.icon} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate('Welcome')}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  goBackButton: {
    padding: 10,
    alignItems: 'flex-start',
    marginLeft: 280,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Half of width/height for perfect circle
    overflow: 'hidden', // Ensures image is clipped to circle
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginTop: 10,
    color: '#04366D',
  },
  drawerItems: {
    paddingVertical: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#04366D',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: '#04366D',
    paddingVertical: 10,
    alignItems: 'center',
    margin: 30,
    borderRadius: 5,
    marginBottom: 50,
  },
  logoutText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
});

export default CustomDrawer;