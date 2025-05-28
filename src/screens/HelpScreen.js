import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import TopNavBar from '../components/TopNavBar';
import BottomNavBar from '../components/BottomNavBar';

const HelpScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TopNavBar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>How to Use Guard Spire</Text>

        {/* Section 1: Dashboard Overview */}
        <Text style={styles.sectionTitle}>1. Dashboard Overview</Text>
        <Image source={require('../assets/third.jpg')} style={styles.image} resizeMode="contain" />
        <Text style={styles.description}>
          The dashboard gives you a snapshot of your device's protection status.
          Tap "Quick Scan" to analyze new scams. You can also view real-time
          scam alerts, their severity, and suggested actions.
        </Text>

        {/* Section 2: Scam Alert Details */}
        <Text style={styles.sectionTitle}>2. Scam Alert Details</Text>
        <Image source={require('../assets/third.jpg')} style={styles.image} resizeMode="contain" />
        <Text style={styles.description}>
          View detailed information about detected scams. You'll find
          descriptions, indicators, and what actions to take if a threat is
          found.
        </Text>

        {/* Section 3: Manual Scanner */}
        <Text style={styles.sectionTitle}>3. Manual Scanner</Text>
        <Image source={require('../assets/forth.jpg')} style={styles.image} resizeMode="contain" />
        <Text style={styles.description}>
          Use the Msg & URL Scanner to analyze suspicious text messages, links,
          or emails. Just paste the content and tap "Scan" to get a risk
          analysis instantly.
        </Text>

        {/* Section 4: Report History */}
        <Text style={styles.sectionTitle}>4. Scan Report History</Text>
        <Image source={require('../assets/fifth.jpg')} style={styles.image} resizeMode="contain" />
        <Text style={styles.description}>
          All your scans are saved under "History." Tap a report to view its
          full details, status, and recommendation again.
        </Text>

        {/* Section 5: Settings */}
        <Text style={styles.sectionTitle}>5. Customize Settings</Text>
        <Image source={require('../assets/sixth.jpg')} style={styles.image} resizeMode="contain" />
        <Text style={styles.description}>
          Control how Guard Spire behaves — update your account details,
          password, alert levels, notification types, and more from the Settings
          page.
        </Text>

        {/* Section 6: Navigation */}
        <Text style={styles.sectionTitle}>6. Navigation & Logout</Text>
        <Image source={require('../assets/second.jpg')} style={styles.image} resizeMode="contain" />
        <Text style={styles.description}>
          Access all app features from the side drawer. You can navigate to the
          dashboard, scan tools, reports, and settings — and log out securely.
        </Text>
      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EEE',
    fontFamily: 'Poppins-Medium',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 140,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#04366D',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#04366D',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default HelpScreen;
