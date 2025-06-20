import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';


// 定义导航类型
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const HomePage = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('Good morning');

  // 设置问候语和当前时间
  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hours = now.getHours();

      // 设置问候语
      if (hours < 12) {
        setGreeting('Good morning');
      } else if (hours < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }

      // 设置当前时间
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateTimeAndGreeting();
    const timer = setInterval(updateTimeAndGreeting, 60000);

    return () => clearInterval(timer);
  }, []);

  // 快速操作数据
  const quickActions = [
    { id: '2', icon: 'event', name: 'Calendar', count: 3, screen: 'Calendar' },
    { id: '3', icon: 'email', name: 'Messages', count: 12, screen: 'Messages' },
    { id: '5', icon: 'check-circle', name: 'Attendance', count: 0, screen: 'Attendance' },
    { id: '6', icon: 'description', name: 'Documents', count: 2, screen: 'Documents' },
  ];

  // 公告数据
  const announcements = [
    {
      id: '1',
      title: 'Quarterly Meeting',
      date: 'May 15, 2025',
      content: 'Join us this Friday for the quarterly all-hands meeting at the main auditorium. All employees are required to attend.',
      image: require('../assets/announcement1.png')
    },
    {
      id: '2',
      title: 'System Maintenance',
      date: 'May 18, 2025',
      content: 'System will be down for maintenance this Sunday from 2AM to 6AM. Please save your work before then.',
      image: require('../assets/announcement2.png')
    },
    {
      id: '3',
      title: 'New Benefits Package',
      date: 'May 20, 2025',
      content: 'Check your email for details about our updated employee benefits package. Enrollment period ends June 15th.',
      image: require('../assets/announcement3.png')
    },
  ];

  // 最近活动数据
  const recentActivities = [
    { id: '1', title: 'New project assigned', time: '2 hours ago', icon: 'assignment' },
    { id: '2', title: 'Meeting at 3:00 PM', time: 'Yesterday', icon: 'event' },
    { id: '3', title: 'Document approved', time: '2 days ago', icon: 'description' },
    { id: '4', title: 'Task completed: UI Design', time: '3 days ago', icon: 'check-circle' },
    { id: '5', title: 'Salary credited', time: '5 days ago', icon: 'attach-money' },
  ];

  // 团队成员数据
  const teamMembers = [
    { id: '1', name: 'Alex Chen', role: 'Designer', status: 'Online' },
    { id: '2', name: 'Sam Wilson', role: 'Developer', status: 'In Meeting' },
    { id: '3', name: 'Taylor Kim', role: 'QA Engineer', status: 'Online' },
    { id: '4', name: 'Jordan Lee', role: 'Project Manager', status: 'Offline' },
  ];

  // 处理快速操作点击
  const handleQuickAction = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  // 处理通知点击
  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  // 渲染快速操作项
  const renderQuickAction = ({ item }: { item: typeof quickActions[0] }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={() => handleQuickAction(item.screen as keyof RootStackParamList)}
    >
      <View style={styles.actionIcon}>
        <Icon name={item.icon} size={28} color="#3498db" />
        {item.count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.count}</Text>
          </View>
        )}
      </View>
      <Text style={styles.actionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // 渲染公告项
  const renderAnnouncement = ({ item }: { item: typeof announcements[0] }) => (
    <View style={styles.announcementCard}>
      <Image source={item.image} style={styles.announcementImage} />
      <View style={styles.announcementContent}>
        <Text style={styles.announcementTitle}>{item.title}</Text>
        <Text style={styles.announcementText}>{item.content}</Text>
        <Text style={styles.announcementDate}>{item.date}</Text>
      </View>
    </View>
  );

  // 渲染活动项
  const renderActivity = ({ item }: { item: typeof recentActivities[0] }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Icon name={item.icon} size={20} color="#3498db" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );

  // 渲染团队成员项
  const renderTeamMember = ({ item }: { item: typeof teamMembers[0] }) => (
    <View style={styles.teamMember}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, item.status === 'Online' && styles.onlineStatus]} />
        {item.status === 'Online' && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberRole}>{item.role}</Text>
      </View>
      <Text style={[
        styles.memberStatus,
        item.status === 'Online' && styles.statusOnline,
        item.status === 'In Meeting' && styles.statusMeeting,
        item.status === 'Offline' && styles.statusOffline
      ]}>
        {item.status}
      </Text>
      <TouchableOpacity style={styles.messageButton}>
        <Icon name="message" size={20} color="#3498db" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 头部区域 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.username}>John Doe</Text>
            <Text style={styles.time}>{currentTime}</Text>
          </View>
          <TouchableOpacity onPress={handleNotifications} style={styles.notificationButton}>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
            <Icon name="notifications" size={28} color="#2c3e50" />
          </TouchableOpacity>
        </View>

        {/* 快速操作区域 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <FlatList
          data={quickActions}
          renderItem={renderQuickAction}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.quickActions}
          scrollEnabled={false}
          contentContainerStyle={styles.quickActionsContainer}
        />

        {/* 公告区域 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Company Announcements</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={announcements}
          renderItem={renderAnnouncement}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.announcementsContainer}
        />

        {/* 最近活动区域 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.activityList}>
          <FlatList
            data={recentActivities}
            renderItem={renderActivity}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    marginBottom: 30,
    marginTop: 10,
  },
  greeting: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  time: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  seeAll: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  quickActionsContainer: {
    paddingBottom: 5,
  },
  quickActions: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionIcon: {
    position: 'relative',
    marginBottom: 10,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 5,
  },
  announcementsContainer: {
    paddingBottom: 10,
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 300,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  announcementImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  announcementContent: {
    padding: 20,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  },
  announcementText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    lineHeight: 20,
  },
  announcementDate: {
    fontSize: 13,
    color: '#bdc3c7',
    fontWeight: '500',
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 14,
    color: '#95a5a6',
  },
  teamContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineStatus: {
    backgroundColor: '#e8f5e9',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  memberStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 15,
  },
  statusOnline: {
    color: '#4CAF50',
  },
  statusMeeting: {
    color: '#FF9800',
  },
  statusOffline: {
    color: '#9E9E9E',
  },
  messageButton: {
    padding: 8,
  },
});

export default HomePage;