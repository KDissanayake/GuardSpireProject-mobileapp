import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';

const ForgotPasswordModalController = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const resetAll = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setEmailError('');
    setOtpError('');
    setPasswordError('');
    onClose();
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password/request', {
        email: email.trim(),
      });
      setStep(2);
      setEmailError('');
    } catch (error) {
      setEmailError(error.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleOtpVerify = async () => {
    if (!otp.trim()) {
      setOtpError('OTP is required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password/verify-otp', {
        email: email.trim(),
        otp: otp.trim(),
      });
      setStep(3);
      setOtpError('');
    } catch (error) {
      setOtpError(error.response?.data?.error || 'Invalid OTP');
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError('Both password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password/reset', {
        email: email.trim(),
        newPassword,
        confirmPassword,
      });
      setPasswordError('');
      setStep(4);
    } catch (error) {
      setPasswordError(error.response?.data?.error || 'Password reset failed');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ModalView title="Forgot Password">
            <TextInput
              placeholder="Enter your email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </ModalView>
        );
      case 2:
        return (
          <ModalView title="Enter OTP">
            <TextInput
              placeholder="Enter OTP"
              style={styles.input}
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
            {otpError ? <Text style={styles.error}>{otpError}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleOtpVerify}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </ModalView>
        );
      case 3:
        return (
          <ModalView title="Reset Password">
            <TextInput
              placeholder="New Password"
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {passwordError ? (
              <Text style={styles.error}>{passwordError}</Text>
            ) : null}
            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </ModalView>
        );
      case 4:
        return (
          <ModalView title="Success">
            <Text style={{ marginBottom: 10 }}>
              Your password has been reset successfully!
            </Text>
            <TouchableOpacity style={styles.button} onPress={resetAll}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </ModalView>
        );
      default:
        return null;
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={resetAll}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>{renderStep()}</TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const ModalView = ({ title, children }) => (
  <View style={styles.modalBox}>
    {title && <Text style={styles.modalTitle}>{title}</Text>}
    {children}
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#04366D',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#04366D',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ForgotPasswordModalController;
