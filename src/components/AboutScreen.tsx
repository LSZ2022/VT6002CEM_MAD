import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types';


type AboutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'About'>;

interface AboutScreenProps {
  navigation: AboutScreenNavigationProp;
}

interface AboutItem {
  icon: string;
  name: string;
  value?: string;
  action?: () => void;
}

interface TeamMember {
  name: string;
  role: string;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const appVersion = '1.2.5';
  const buildNumber = '20230614.1';

  const aboutItems = [
    { icon: 'info', name: 'Version', value: `${appVersion} (${buildNumber})` },
    { icon: 'update', name: 'Check for Updates', action: () => Linking.openURL('https://companyportal.com/updates') },
    { icon: 'description', name: 'Terms of Service', action: () => Linking.openURL('https://companyportal.com/terms') },
    { icon: 'privacy-tip', name: 'Privacy Policy', action: () => Linking.openURL('https://companyportal.com/privacy') },
    { icon: 'copyright', name: 'Copyright', value: `© ${new Date().getFullYear()} Company Portal` },
  ];

  const teamMembers = [
    { name: 'Development Team', role: 'Engineering' },
    { name: 'Product Design', role: 'UX/UI Design' },
    { name: 'Quality Assurance', role: 'Testing & Validation' },
    { name: 'Customer Support', role: 'User Assistance' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Icon name="business" size={48} color="#3498db" />
          </View>
          <Text style={styles.appName}>Company Portal</Text>
          <Text style={styles.appDescription}>Connecting employees, simplifying work</Text>
        </View>

        {/* App Info */}
        <View style={styles.card}>
          {aboutItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.item, index !== aboutItems.length - 1 && styles.itemBorder]}
              onPress={item.action}
            >
              <View style={styles.itemLeft}>
                <Icon name={item.icon} size={24} color="#3498db" style={styles.itemIcon} />
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
              
              <View style={styles.itemRight}>
                {item.value ? (
                  <Text style={styles.itemValue}>{item.value}</Text>
                ) : (
                  <Icon name="chevron-right" size={24} color="#bdc3c7" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <View style={styles.teamContainer}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamMember}>
                <View style={styles.avatar}>
                  <Icon name="person" size={24} color="#3498db" />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Company Portal is developed to enhance employee experience and streamline 
          internal communications. We're committed to providing a secure and 
          efficient platform for all your work needs.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 16,
  },
  itemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  itemRight: {},
  itemValue: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  teamContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default AboutScreen;