import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar, DateData } from 'react-native-calendars'; // 添加 DateData 类型
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type CalendarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Calendar'>;

// 定义事件类型
interface EventItem {
  id: string;
  title: string;
  time: string;
  location: string;
}

// 使用 Record 类型解决索引问题
type EventsByDate = Record<string, EventItem[]>;

const CalendarScreen = () => {
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
// Simulated event data - using Record type
const events: EventsByDate = {
  '2025-05-15': [{id: '1', title: 'Quarterly Meeting', time: '10:00 AM', location: 'Main Conference Room'}],
  '2025-05-18': [{id: '2', title: 'System Maintenance', time: '2:00 AM', location: 'Online Meeting'}],
  '2025-05-20': [
    {id: '3', title: 'Project Review', time: '2:00 PM', location: 'Building B, Room 203'},
    {id: '4', title: 'Team Dinner', time: '7:00 PM', location: 'Garden Restaurant'}
  ],
};

  const dayEvents = events[selectedDate] || [];

  // 创建标记日期对象
  const markedDates: { [date: string]: any } = {
    [selectedDate]: { selected: true, selectedColor: '#3498db' }
  };

  // 为有事件的日期添加标记
  Object.keys(events).forEach(date => {
    if (!markedDates[date]) {
      markedDates[date] = { marked: true, dotColor: '#e74c3c' };
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* 标题栏 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={28} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={28} color="#3498db" />
          </TouchableOpacity>
        </View>

        {/* 日历组件 */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              selectedDayBackgroundColor: '#3498db',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#3498db',
              dayTextColor: '#2c3e50',
              textDisabledColor: '#d9e1e8',
              arrowColor: '#3498db',
              monthTextColor: '#2c3e50',
              textMonthFontWeight: 'bold',
              textMonthFontSize: 18,
            }}
          />
        </View>

        {/* 当日事件列表 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          <Text style={styles.eventCount}>{dayEvents.length} Events</Text>
        </View>

        {dayEvents.length > 0 ? (
          <View style={styles.eventsContainer}>
            {dayEvents.map((event) => (
              <TouchableOpacity key={event.id} style={styles.eventCard}>
                <View style={styles.eventTimeContainer}>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventLocation}>
                    <Icon name="location-on" size={16} color="#95a5a6" />
                    <Text style={styles.locationText}>{event.location}</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color="#bdc3c7" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="event-busy" size={60} color="#ecf0f1" />
            <Text style={styles.emptyText}>No Event Today</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ... 样式保持不变 ...
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
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    padding: 5,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
  eventCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  eventsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventTimeContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 15,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#95a5a6',
    marginLeft: 5,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    color: '#bdc3c7',
    marginTop: 15,
    fontWeight: '500',
  },
});

export default CalendarScreen;