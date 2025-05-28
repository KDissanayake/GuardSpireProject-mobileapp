import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateOtpFlowModal from '../modals/UpdateOtpFlowModal';
import ForgotPasswordModalController from '../modals/ForgotPasswordModalController';

const SignInScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('email', trimmedEmail);
        setShowOtpModal(true);
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Sign-in failed. Please try again.';
      console.error('Sign in failed:', msg);
      setError(msg);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email to reset password.');
      return;
    }
    setShowForgotPasswordModal(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../assets/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>GUARD SPIRE</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              name={passwordVisible ? 'eye' : 'eye-slash'}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordLink}
          onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpLink}>
            Don’t have an account?{' '}
            <Text style={styles.signUpBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <UpdateOtpFlowModal
        visible={showOtpModal}
        purpose="login"
        onClose={() => setShowOtpModal(false)}
        skipThankYou={true}
        onOtpSuccess={() => {
          console.log('OTP verified. Navigating to Dashboard...');
          navigation.navigate('Main', { screen: 'Dashboard' });
        }}
      />

      <ForgotPasswordModalController
        visible={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    letterSpacing: 7,
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  input: {
    width: '100%',
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 30,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 30,
  },
  inputPassword: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 60,
  },
  forgotPasswordText: {
    color: '#04366D',
    fontSize: 14,
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: '#04366D',
    paddingVertical: 12,
    paddingHorizontal: 110,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpLink: {
    fontSize: 14,
    color: '#000',
  },
  signUpBold: {
    color: '#04366D',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default SignInScreen;
