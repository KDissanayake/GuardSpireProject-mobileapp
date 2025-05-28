import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WarningPopup = ({ visible, onClose, notificationData, navigationRef }) => {
  const [action, setAction] = useState('');

  const handleFullClose = () => {
    setAction('');
    onClose();
  };

  const handleLearnMore = () => {
    if (navigationRef?.isReady()) {
      navigationRef.navigate('Report', {
        scanId: notificationData?.scan_id,
        spamData: notificationData,
      });
    }
    onClose();
  };

  const getToken = async () => await AsyncStorage.getItem('token');

  const handleBlockAndReport = async () => {
    try {
      const token = await getToken();
      const scanId = notificationData?.scan_id;
      if (!scanId) return Alert.alert('Scan ID missing');

      const res = await axios.post(
        `http://localhost:5000/api/scan/manual/report/${scanId}/report`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Scan reported:', res.data);
      Alert.alert('Reported', 'Scan has been reported successfully.');
      handleFullClose();
    } catch (error) {
      console.error('❌ Report failed:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to report scan.');
    }
  };

  const handleAllow = () => {
    console.log('⚠️ User chose to allow the threat');
    handleFullClose();
  };

  const config = {
    block: {
      title: 'Warning!',
      message: 'This website may be unsafe. Are you sure you want to continue?',
      color: '#FFA000',
      icon: require('../assets/warning-yellow.png'),
      confirm: handleBlockAndReport,
    },
    blockReport: {
      title: 'Warning!',
      message: 'This website may be unsafe. Are you sure you want to continue?',
      color: '#FFA000',
      icon: require('../assets/warning-yellow.png'),
      confirm: handleBlockAndReport,
    },
    allow: {
      title: 'Warning!',
      message:
        'This website is flagged as a potential threat. Are you sure you want to continue?',
      color: '#D32F2F',
      icon: require('../assets/warning-red.png'),
      confirm: handleAllow,
    },
  }[action];

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        {action ? (
          <View style={[styles.popupBox, { borderColor: config.color }]}>
            <Image source={config.icon} style={styles.icon} />
            <Text style={[styles.title, { color: config.color }]}>{config.title}</Text>
            <Text style={styles.message}>{config.message}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => setAction('')}>
                <Text style={[styles.link, { color: 'blue' }]}>Go Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={config.confirm}>
                <Text style={[styles.link, { color: 'blue' }]}>
                  {action === 'allow' ? 'Allow Anyway' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.popupBox}>
            <Image source={require('../assets/Logo.png')} style={styles.icon} />
            <Text style={[styles.title, { color: '#B00020' }]}>
              Warning: Potential Threat Detected!
            </Text>
            <Text style={styles.message}>
              This content may steal your personal information or passwords. It's recommended to close this page immediately.
            </Text>
            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={() => setAction('block')}>
                <Text style={styles.link}>Block</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAction('blockReport')}>
                <Text style={styles.link}>Block & Report</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAction('allow')}>
                <Text style={styles.link}>Allow</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLearnMore}>
                <Text style={styles.link}>Learn More...</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  linksContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginVertical: 6,
  },
});

export default WarningPopup;
