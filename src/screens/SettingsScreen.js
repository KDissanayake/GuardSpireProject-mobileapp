import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TopNavBar from '../components/TopNavBar';
import BottomNavBar from '../components/BottomNavBar';
import DeleteFlowModalController from '../modals/DeleteFlowModalController';
import UpdateOtpFlowModal from '../modals/UpdateOtpFlowModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ForgotPasswordModalController from '../modals/ForgotPasswordModalController';

const SettingsScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [autoDetection, setAutoDetection] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [scamAlerts, setScamAlerts] = useState(true);
  const [notificationType, setNotificationType] = useState('popup');
  const [notifyHighRisk, setNotifyHighRisk] = useState(true);
  const [notifyAllSuspicious, setNotifyAllSuspicious] = useState(true);
  const [instantNotification, setInstantNotification] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [soundForScamAlerts, setSoundForScamAlerts] = useState(true);
  const [vibrationOnNotification, setVibrationOnNotification] = useState(true);
  const [deleteReason, setDeleteReason] = useState(null);
  const [otherReason, setOtherReason] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpTarget, setOtpTarget] = useState(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [usernameUpdateMsg, setUsernameUpdateMsg] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailUpdateMsg, setEmailUpdateMsg] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdateMsg, setPasswordUpdateMsg] = useState('');
  const [otp, setOtp] = useState('');
  const [otpType, setOtpType] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Fetch profile picture and email on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('No token found');
          return;
        }

        const response = await axios.get(
          'http://localhost:5000/api/account/profile',
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.status === 200) {
          if (response.data.imageUrl) {
            setProfileImage(`http://localhost:5000${response.data.imageUrl}`);
          }
          if (response.data.email) {
            setCurrentEmail(response.data.email);
            await AsyncStorage.setItem('email', response.data.email);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Handles Image Selection and Upload
  const handleEditProfile = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async response => {
      if (response.didCancel) {
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          type: response.assets[0].type || 'image/jpeg',
          name: response.assets[0].fileName || 'profile.jpg',
        });

        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.log('No token found');
            return;
          }

          const uploadResponse = await axios.post(
            'http://localhost:5000/api/account/upload-profile',
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );

          if (uploadResponse.status === 200) {
            setProfileImage(
              `http://localhost:5000${uploadResponse.data.imageUrl}`,
            );
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
        }
      }
    });
  };

  const handleRemoveImage = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/account/remove-profile',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Error removing profile picture:', error);
    }
    setModalVisible(false);
  };

  const showEditOptions = event => {
    const { pageX, pageY } = event.nativeEvent;
    setModalPosition({ x: pageX, y: pageY });
    setModalVisible(true);
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await axios.get(
        'http://localhost:5000/api/account/profile',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        if (response.data.imageUrl) {
          setProfileImage(`http://localhost:5000${response.data.imageUrl}`);
        }
        if (response.data.email) {
          setCurrentEmail(response.data.email);
          await AsyncStorage.setItem('email', response.data.email);
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setEmailUpdateMsg('Failed to refresh profile. Please log in again.');
      if (error.response && error.response.status === 401) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('email');
        navigation.navigate('Login');
      }
    }
  };

  // Function to refresh scan data (placeholder, adapt to your scan display logic)
  const refreshScans = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await axios.get(
        'http://localhost:5000/api/account/scans',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        console.log('Refreshed scans:', response.data.scans);
        // Update scan-related state or notify other screens
        // Example: If scans are displayed in another screen, emit an event or update global state
        // For now, log the scans; adapt this to your app's needs
      }
    } catch (error) {
      console.error('Error refreshing scans:', error);
      setEmailUpdateMsg('Failed to refresh scans. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <TopNavBar navigation={navigation} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={showEditOptions}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('../assets/user.png')
                }
                style={styles.profileImage}
              />
              <View style={styles.editContainer}>
                <Text style={styles.editText}>Edit</Text>
                <Icon name="edit" size={20} color="#04366D" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Expandable Sections */}
          {renderSection(
            'Personal Details',
            'personal',
            expandedSection,
            setExpandedSection,
            () => (
              <View style={styles.sectionContent}>
                {/* Username Update */}
                <Text style={styles.label}>Current Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your current username"
                  value={currentUsername}
                  onChangeText={setCurrentUsername}
                />
                <Text style={styles.label}>New Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your new username"
                  value={newUsername}
                  onChangeText={setNewUsername}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={async () => {
                    try {
                      const token = await AsyncStorage.getItem('token');
                      console.log('Retrieved Token:', token);
                      if (!token) {
                        setUsernameUpdateMsg(
                          'Error: Unauthorized. Please log in.',
                        );
                        return;
                      }

                      const headers = { Authorization: `Bearer ${token}` };
                      const response = await axios.put(
                        'http://localhost:5000/api/account/update-info',
                        { currentUsername, newUsername },
                        { headers },
                      );

                      if (response.status === 200) {
                        setUsernameUpdateMsg('Username updated successfully!');
                        setCurrentUsername('');
                        setNewUsername('');
                      } else {
                        setUsernameUpdateMsg(
                          response.data.error || 'Failed to update username.',
                        );
                      }
                    } catch (error) {
                      if (error.response && error.response.status === 401) {
                        console.error(
                          'Token expired or unauthorized. Redirecting to login.',
                        );
                        setUsernameUpdateMsg(
                          'Session expired. Please log in again.',
                        );
                        navigation.navigate('Login');
                      } else {
                        console.error('Error updating username:', error);
                        setUsernameUpdateMsg(
                          'An error occurred. Please try again.',
                        );
                      }
                    }
                  }}>
                  <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
                {usernameUpdateMsg ? (
                  <Text style={styles.feedbackMessage}>
                    {usernameUpdateMsg}
                  </Text>
                ) : null}

                {/* Email Update */}
                <Text style={styles.label}>Current Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your current email"
                  value={currentEmail}
                  onChangeText={setCurrentEmail}
                />
                <Text style={styles.label}>New Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your new email"
                  value={newEmail}
                  onChangeText={setNewEmail}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={async () => {
                    try {
                      const token = await AsyncStorage.getItem('token');
                      if (!token) {
                        setEmailUpdateMsg(
                          'Error: Unauthorized. Please log in.',
                        );
                        return;
                      }

                      if (!newEmail) {
                        setEmailUpdateMsg('Please enter a new email address.');
                        return;
                      }

                      const headers = { Authorization: `Bearer ${token}` };
                      const response = await axios.post(
                        'http://localhost:5000/api/account/request-otp-update',
                        { type: 'email', newEmail },
                        { headers },
                      );

                      if (response.status === 200) {
                        setOtpTarget('email');
                        setShowOtpModal(true);
                        setEmailUpdateMsg('OTP sent for email update.');
                      } else {
                        setEmailUpdateMsg(
                          response.data.error || 'Failed to request OTP.',
                        );
                      }
                    } catch (error) {
                      console.error('Error requesting OTP:', error);
                      setEmailUpdateMsg('An error occurred. Please try again.');
                    }
                  }}>
                  <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
                {emailUpdateMsg ? (
                  <Text style={styles.feedbackMessage}>{emailUpdateMsg}</Text>
                ) : null}
              </View>
            ),
          )}

          {renderSection(
            'Password',
            'password',
            expandedSection,
            setExpandedSection,
            () => (
              <View style={styles.sectionContent}>
                <Text style={styles.label}>Current Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.inputWithoutBox}
                    secureTextEntry={!showCurrentPassword}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.iconContainer}>
                    <Icon
                      name={
                        showCurrentPassword ? 'visibility' : 'visibility-off'
                      }
                      size={20}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.inputWithoutBox}
                    secureTextEntry={!showNewPassword}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.iconContainer}>
                    <Icon
                      name={showNewPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => setShowForgotPasswordModal(true)}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={async () => {
                    try {
                      const token = await AsyncStorage.getItem('token');
                      if (!token) {
                        setPasswordUpdateMsg(
                          'Error: Unauthorized. Please log in.',
                        );
                        return;
                      }

                      const headers = { Authorization: `Bearer ${token}` };
                      const response = await axios.post(
                        'http://localhost:5000/api/account/request-otp-update',
                        { type: 'password' },
                        { headers },
                      );

                      if (response.status === 200) {
                        setOtpTarget('password');
                        setShowOtpModal(true);
                        setPasswordUpdateMsg('OTP sent for password update.');
                      } else {
                        setPasswordUpdateMsg(
                          response.data.error || 'Failed to request OTP.',
                        );
                      }
                    } catch (error) {
                      console.error('Error requesting OTP:', error);
                      setPasswordUpdateMsg(
                        'An error occurred. Please try again.',
                      );
                    }
                  }}>
                  <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
                {passwordUpdateMsg ? (
                  <Text style={styles.feedbackMessage}>
                    {passwordUpdateMsg}
                  </Text>
                ) : null}
              </View>
            ),
          )}

          {/* Delete Account Section */}
          {renderSection(
            'Delete Account',
            'deleteAccount',
            expandedSection,
            setExpandedSection,
            () => (
              <View style={styles.sectionContent}>
                <Text style={styles.label}>
                  We are really sorry to see you go. Are you sure you want to
                  delete your account? Once you confirm your data will be gone.
                </Text>

                <View style={styles.radioGroupDelete}>
                  {[
                    {
                      key: 'noLongerUsing',
                      label: 'I am no longer using my account',
                    },
                    { key: 'serviceNotGood', label: 'The service is not good' },
                    {
                      key: 'dontUnderstand',
                      label: "I don't understand how to use",
                    },
                    { key: 'dontNeed', label: "I don't need this app anymore" },
                    { key: 'other', label: 'Other' },
                  ].map(item => (
                    <View style={styles.radioOption} key={item.key}>
                      <RadioButton
                        value={item.key}
                        status={
                          deleteReason === item.key ? 'checked' : 'unchecked'
                        }
                        onPress={() => setDeleteReason(item.key)}
                        color="#04366D"
                      />
                      <Text style={styles.deleteLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>

                {deleteReason === 'other' && (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your reason here"
                    value={otherReason}
                    onChangeText={setOtherReason}
                  />
                )}

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={async () => {
                    try {
                      const token = await AsyncStorage.getItem('token');
                      if (!token) {
                        alert('Authentication required');
                        return;
                      }

                      const reason =
                        deleteReason === 'other' && otherReason.trim() !== ''
                          ? otherReason
                          : deleteReason;

                      const response = await axios.post(
                        'http://localhost:5000/api/delete/reason',
                        { reason },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );

                      if (response.status === 200) {
                        setShowDeleteModal(true);
                      } else {
                        alert(response.data.error || 'Failed to save reason.');
                      }
                    } catch (error) {
                      console.error('Error saving delete reason:', error);
                      alert('Something went wrong. Try again.');
                    }
                  }}>
                  <Text style={styles.saveText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            ),
          )}

          {/* Help Button */}
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => navigation.navigate('Help')}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <BottomNavBar navigation={navigation} />

      {/* Modal for Image Options */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View
            style={[
              styles.modalContent,
              { top: modalPosition.y, left: modalPosition.x },
            ]}>
            <TouchableOpacity
              style={styles.transparentButton}
              onPress={handleEditProfile}>
              <Icon name="photo-library" size={20} color="#04366D" />
              <Text style={styles.modalButtonText}>Select Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.transparentButton}
              onPress={handleRemoveImage}>
              <Icon name="delete" size={20} color="#04366D" />
              <Text style={styles.modalButtonText}>Remove Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.transparentButton}
              onPress={() => setModalVisible(false)}>
              <Icon name="cancel" size={20} color="#04366D" />
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Delete Account Modal Controller */}
      <DeleteFlowModalController
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />

      {/* Update OTP Modal */}
      <UpdateOtpFlowModal
        visible={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setOtp('');
          setOtpMsg('');
          setOtpTarget(null);
        }}
        onOtpSuccess={async () => {
          if (otpTarget === 'email') {
            setEmailUpdateMsg('Email updated successfully!');
            setCurrentEmail('');
            setNewEmail('');
            await refreshProfile();
            await refreshScans(); // Refresh scans after email update
          } else if (otpTarget === 'password') {
            setPasswordUpdateMsg('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
          }
          setShowOtpModal(false);
          setOtp('');
          setOtpMsg('');
          setOtpTarget(null);
        }}
        skipOtp={otpTarget === 'username'}
        purpose={otpTarget}
        currentEmail={currentEmail}
        newEmail={newEmail}
        currentPassword={currentPassword}
        newPassword={newPassword}
      />

      <ForgotPasswordModalController
        visible={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </View>
  );
};

// Reusable Section Component
const renderSection = (
  title,
  key,
  expandedSection,
  setExpandedSection,
  content,
) => (
  <View>
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={() => setExpandedSection(expandedSection === key ? null : key)}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Icon
        name={expandedSection === key ? 'expand-less' : 'expand-more'}
        size={20}
        color="#fff"
      />
    </TouchableOpacity>
    {expandedSection === key && content()}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 25,
    paddingBottom: 175,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
  },
  editText: {
    color: '#04366D',
    marginRight: 5,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  sectionHeader: {
    backgroundColor: '#04366D',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  sectionContent: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginVertical: 5,
    color: '#04366D',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#04366D',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpButton: {
    backgroundColor: '#04366D',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  helpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginTop: -45,
    marginLeft: 40,
  },
  transparentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    marginVertical: 5,
    width: '100%',
    backgroundColor: 'transparent',
  },
  modalButtonText: {
    color: '#04366D',
    fontSize: 14,
    marginLeft: 10,
    padding: 0,
    fontFamily: 'Poppins-Regular',
  },
  priorityLabel: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 10,
    color: '#04366D',
    fontFamily: 'Poppins-Bold',
  },
  priorityText: {
    fontSize: 10,
    color: 'red',
    marginTop: 10,
    fontFamily: 'Poppins-Medium',
    justifyContent: 'left',
    alignItems: 'left',
    textAlign: 'left',
    marginLeft: 10,
  },
  priority: {
    fontSize: 14,
    color: '#04366D',
    fontFamily: 'Poppins-Bold',
    marginLeft: -50,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  radioGroups: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 0,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  sectionTitles: {
    color: '#04366D',
    fontSize: 16,
    fontWeight: 'bold',
  },
  box: {
    backgroundColor: '#E8E8E8',
    padding: 12,
    borderRadius: 5,
    marginVertical: 5,
  },
  radioText: {
    fontSize: 14,
    color: '#04366D',
    fontFamily: 'Poppins-Bold',
    marginLeft: 5,
    marginRight: 30,
  },
  deleteLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginLeft: 5,
  },
  radioGroupDelete: {
    flexDirection: 'column',
    textAlign: 'left',
    marginVertical: 10,
    padding: 5,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedbackMessage: {
    marginTop: 10,
    fontSize: 14,
    color: '#FF0000',
    fontFamily: 'Poppins-Medium',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginRight: 10,
  },
  inputWithoutBox: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#04366D',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;