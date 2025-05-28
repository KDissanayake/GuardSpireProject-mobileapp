import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateOtpFlowModal = ({
  visible,
  onClose,
  onOtpSuccess,
  skipOtp = false,
  purpose,
  currentEmail,
  newEmail,
  currentPassword,
  newPassword,
}) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setStep(skipOtp ? 3 : 1);
      setOtp('');
      setOtpError('');
    }
  }, [visible, skipOtp]);

  const handleClose = () => {
    setOtp('');
    setOtpError('');
    setStep(1);
    onClose();
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      setOtpError('Please enter the OTP.');
      return;
    }

    const validPurposes = ['signup', 'login', 'email', 'password', 'username'];
    if (!validPurposes.includes(purpose)) {
      setOtpError('Invalid OTP purpose.');
      return;
    }

    try {
      setSubmitting(true);
      const email = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      let response;

      if (purpose === 'signup' || purpose === 'login') {
        response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
          email,
          otp,
          purpose,
        });

        if (response.status === 200 && response.data.token) {
          await AsyncStorage.setItem('token', response.data.token);
        }
      } else if (purpose === 'email' || purpose === 'password') {
        response = await axios.post(
          'http://localhost:5000/api/account/verify-update-otp',
          {
            otp,
            type: purpose,
            ...(purpose === 'email' && { currentEmail, newEmail }),
            ...(purpose === 'password' && { currentPassword, newPassword }),
          },
          { headers }
        );
      } else if (purpose === 'username') {
        // Username updates skip OTP, handled in SettingsScreen
        setStep(3);
        onOtpSuccess?.();
        setSubmitting(false);
        return;
      }

      if (response?.status === 200) {
        setStep(3);
        onOtpSuccess?.();
      } else {
        setOtpError('OTP verification failed.');
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'OTP verification failed.';
      setOtpError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    if (step === 1 && !skipOtp) {
      return (
        <View style={styles.box}>
          <Text style={styles.message}>
            We've sent a one-time password to your email. Please enter it to continue.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (step === 2) {
      return (
        <View style={styles.box}>
          <Text style={styles.title}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="6-digit OTP"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
          {otpError ? <Text style={styles.error}>{otpError}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={submitting}>
            <Text style={styles.buttonText}>{submitting ? 'Verifying...' : 'Verify'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (step === 3) {
      return (
        <View style={styles.box}>
          <Text style={styles.successHeading}>Success!</Text>
          <Text style={styles.thankYou}>OTP verified successfully.</Text>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View>{renderStep()}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#04366D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    color: '#04366D',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  thankYou: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#04366D',
    marginBottom: 15,
  },
});

export default UpdateOtpFlowModal;