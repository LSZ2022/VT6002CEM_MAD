import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types';

const MePage = () => {
  const menuItems = [
    { icon: 'person', name: 'Profile', action: () => navigation.navigate('Profile') },
    { icon: 'help', name: 'Help Center', action: () => navigation.navigate('HelpCenter') },
    { icon: 'info', name: 'About', action: () => navigation.navigate('About') },
    { icon: 'exit-to-app', name: 'Logout', action: () => handleLogout() },
  ];

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  

  const handleLogout = () => {
    // 执行登出逻辑（清除token、用户数据等）
    // 然后导航到登录屏幕
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image 
          source={require('../assets/profile-placeholder.png')} 
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profilePosition}>Senior Developer</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.menuIcon}>
              <Icon name={item.icon} size={24} color="#3498db" />
            </View>
            <Text style={styles.menuText}>{item.name}</Text>
            <Icon name="chevron-right" size={24} color="#bdc3c7" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3498db',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  profilePosition: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  menuContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  menuIcon: {
    width: 40,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
});

export default MePage;