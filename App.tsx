import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LoginScreen from './src/screens/LoginScreen';
import WelcomePage from './src/screens/WelcomePage';
import HomePage from './src/screens/HomePage';
import MePage from './src/screens/MePage';
import InventoryScreen from './src/screens/InventoryScreen';
import BookingScreen from './src/screens/BookingScreen';
import CalendarScreen from './src/components/CalendarScreen';
import DocumentsScreen from './src/components/DocumentsScreen';
import MessagesScreen from './src/components/MessagesScreen';
import AttendanceScreen from './src/components/AttendanceScreen';
import AboutScreen from './src/components/AboutScreen';
import HelpCenterScreen from './src/components/HelpCenterScreen';
import ProfileScreen from './src/components/ProfileScreen';
import SettingsScreen from './src/components/SettingsScreen';


export type RootStackParamList = {
  MainTabs: undefined;
  Tasks: undefined;
  Calendar: undefined;
  Messages: undefined;
  Team: undefined;
  Attendance: undefined;
  Documents: undefined;
  Notifications: undefined;
  // 其他路由...
};

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string; 

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Inventory') {
            iconName = 'inventory';
          } else if (route.name === 'Booking') {
            iconName = 'event';
          } else if (route.name === 'Me') {
            iconName = 'person';
          } else {
            iconName = 'null';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="Me" component={MePage} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      {/* <Stack.Screen name="Tasks" component={TasksScreen} /> */}
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="Notifications" component={DocumentsScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Setting" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}