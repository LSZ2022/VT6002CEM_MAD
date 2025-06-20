import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Picture */}
        <View style={styles.profileImageContainer}>
          <Image 
            source={require('../assets/profile-placeholder.png')} 
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Icon name="edit" size={20} color="#3498db" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              defaultValue="John Doe"
              placeholder="Enter your name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Position</Text>
            <TextInput
              style={styles.input}
              defaultValue="Senior Developer"
              placeholder="Enter your position"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              defaultValue="john.doe@company.com"
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              defaultValue="+1 (555) 123-4567"
              placeholder="Enter your phone"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Department */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Department</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>Engineering</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Team</Text>
            <Text style={styles.infoValue}>Frontend Development</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Manager</Text>
            <Text style={styles.infoValue}>Sarah Johnson</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingBottom: 24,
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
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#3498db',
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 6,
    elevation: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;