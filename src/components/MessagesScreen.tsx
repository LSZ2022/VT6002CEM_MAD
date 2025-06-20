import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type MessagesStackParamList = RootStackParamList & {
  Chat: { conversationId: string };
};

type MessagesScreenNavigationProp = NativeStackNavigationProp<MessagesStackParamList, 'Messages'>;
const MessagesScreen = () => {
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Message data
  const conversations = [
    {
      id: '1',
      name: 'Technical Department',
      lastMessage: 'The new system update has been deployed',
      time: '10:30 AM',
      unread: 3,
      members: ['Alex Chen', 'Sam Wilson', 'Taylor Kim', 'Jordan Lee']
    },
    {
      id: '2',
      name: 'Alex Chen',
      lastMessage: 'The design draft has been sent to you, please check',
      time: 'Yesterday',
      unread: 0,
      isOnline: true
    },
    {
      id: '3',
      name: 'Human Resources Department',
      lastMessage: 'Please submit performance evaluations by this Friday',
      time: 'Yesterday',
      unread: 1
    },
    {
      id: '4',
      name: 'Project Management Team',
      lastMessage: 'Agenda for project review meeting next Wednesday',
      time: '5/15',
      unread: 0
    },
    {
      id: '5',
      name: 'Sam Wilson',
      lastMessage: 'Questions about the API interface',
      time: '5/14',
      unread: 0
    },
    {
      id: '6',
      name: 'Company Announcements',
      lastMessage: '2025 Dragon Boat Festival holiday notice',
      time: '5/10',
      unread: 0
    },
  ];

  const renderConversation = ({ item }: { item: typeof conversations[0] }) => (
    <TouchableOpacity 
      style={styles.conversationCard}
      onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
    >
      <View style={styles.avatar}>
        <View style={styles.avatarInitials}>
          <Text style={styles.avatarText}>
            {item.name.substring(0, 1)}
          </Text>
        </View>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.conversationTime}>
            {item.time}
          </Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        {item.members && (
          <View style={styles.memberContainer}>
            {item.members.slice(0, 3).map((member, index) => (
              <Text key={index} style={styles.memberName} numberOfLines={1}>
                {member}{index < item.members.length - 1 && index < 2 ? ', ' : ''}
              </Text>
            ))}
            {item.members.length > 3 && (
              <Text style={styles.memberCount}>+{item.members.length - 3} people</Text>
            )}
          </View>
        )}
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Messages</Text>
            <Text style={styles.headerSubtitle}>12 conversations</Text>
          </View>
          <TouchableOpacity style={styles.newMessageButton}>
            <Icon name="edit" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search box */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color="#95a5a6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations or contacts"
            placeholderTextColor="#95a5a6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Message list */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Conversations</Text>
        </View>

        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.conversationList}
        />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  newMessageButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2c3e50',
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
  conversationList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    position: 'relative',
    marginRight: 15,
  },
  avatarInitials: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    maxWidth: '70%',
  },
  conversationTime: {
    fontSize: 13,
    color: '#95a5a6',
  },
  lastMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  memberContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 13,
    color: '#95a5a6',
    maxWidth: '30%',
  },
  memberCount: {
    fontSize: 13,
    color: '#3498db',
    fontWeight: '500',
    marginLeft: 5,
  },
  unreadBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MessagesScreen;