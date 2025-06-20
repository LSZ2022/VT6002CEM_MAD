import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

interface SettingsItem {
  icon: string;
  name: string;
  onPress?: () => void;
  value?: string;
  toggle?: boolean;
  onToggle?: (value: boolean) => void;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const settingsItems: SettingsSection[] = [
    {
      title: 'Account Settings',
      items: [
        { 
          icon: 'lock', 
          name: 'Change Password', 
          onPress: () => navigation.navigate('Security') 
        },
        { 
          icon: 'language', 
          name: 'Language', 
          value: 'English' 
        },
        { 
          icon: 'location-on', 
          name: 'Location Services', 
          value: 'Enabled' 
        },
      ]
    },
    {
      title: 'App Preferences',
      items: [
        { 
          icon: 'notifications', 
          name: 'Notifications', 
          toggle: notificationsEnabled, 
          onToggle: setNotificationsEnabled 
        },
        { 
          icon: 'dark-mode', 
          name: 'Dark Mode', 
          toggle: darkModeEnabled, 
          onToggle: setDarkModeEnabled 
        },
        { 
          icon: 'font-download', 
          name: 'Text Size', 
          value: 'Medium' 
        },
      ]
    },
    {
      title: 'Security',
      items: [
        { 
          icon: 'fingerprint', 
          name: 'Biometric Login', 
          toggle: biometricEnabled, 
          onToggle: setBiometricEnabled 
        },
        { 
          icon: 'history', 
          name: 'Login History' 
        },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {settingsItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex} 
                  style={[styles.item, itemIndex !== section.items.length - 1 && styles.itemBorder]}
                  onPress={item.onPress}
                >
                  <View style={styles.itemLeft}>
                    <Icon name={item.icon} size={24} color="#3498db" style={styles.itemIcon} />
                    <Text style={styles.itemText}>{item.name}</Text>
                  </View>
                  
                  <View style={styles.itemRight}>
                    {item.value && (
                      <Text style={styles.itemValue}>{item.value}</Text>
                    )}
                    {item.toggle !== undefined && (
                      <Switch
                        value={item.toggle}
                        onValueChange={item.onToggle}
                        trackColor={{ false: "#ecf0f1", true: "#3498db" }}
                      />
                    )}
                    {!item.value && item.toggle === undefined && (
                      <Icon name="chevron-right" size={24} color="#bdc3c7" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 8,
    paddingLeft: 8,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
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
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 16,
    color: '#7f8c8d',
    marginRight: 8,
  },
});

export default SettingsScreen;