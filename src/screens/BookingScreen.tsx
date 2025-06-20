import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput, 
  Alert, 
  ScrollView
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// 定义类型
type MeetingRoom = {
  id: string;
  name: string;
  capacity: number;
  location: string;
};

type Booking = {
  id: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  status: 'approved' | 'pending' | 'rejected';
};

type Conflict = {
  id: string;
  title: string;
  time: string;
  status: string;
};

type TimeSlot = {
  start: string | null;
  end: string | null;
};

const BookingScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [bookingTime, setBookingTime] = useState<TimeSlot>({ start: null, end: null });
  const [meetingTitle, setMeetingTitle] = useState('');
  const [attendees, setAttendees] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  
  // 会议室数据
  const meetingRooms: MeetingRoom[] = [
    { id: '1', name: 'Conference Room A', capacity: 10, location: 'Floor 3' },
    { id: '2', name: 'Conference Room B', capacity: 8, location: 'Floor 2' },
    { id: '3', name: 'Executive Suite', capacity: 4, location: 'Floor 5' },
    { id: '4', name: 'Training Room', capacity: 20, location: 'Floor 1' },
  ];
  
  // 已预订的会议
  const initialBookings: Booking[] = [
    { id: '101', roomId: '1', date: '2025-06-20', startTime: '09:00', endTime: '10:30', title: 'Team Meeting', status: 'approved' },
    { id: '102', roomId: '2', date: '2025-06-20', startTime: '14:00', endTime: '15:30', title: 'Client Presentation', status: 'pending' },
    { id: '103', roomId: '3', date: '2025-06-20', startTime: '11:00', endTime: '12:00', title: 'Project Review', status: 'approved' },
  ];
  
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null);
  
  // 日期选择变化
  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setSelectedRoom(null);
      setBookingTime({ start: null, end: null });
    }
  };
  
  // 时间转换为分钟数
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  // 检查时间冲突
  const checkConflicts = (): Conflict[] => {
    if (!selectedRoom || !bookingTime.start || !bookingTime.end) return [];
    
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const roomBookings = bookings.filter(booking => 
      booking.roomId === selectedRoom.id && booking.date === formattedDate
    );
    
    const detectedConflicts: Conflict[] = [];
    const startMinutes = timeToMinutes(bookingTime.start);
    const endMinutes = timeToMinutes(bookingTime.end);
    
    // 检查时间段是否重叠
    for (const booking of roomBookings) {
      const bookingStart = timeToMinutes(booking.startTime);
      const bookingEnd = timeToMinutes(booking.endTime);
      
      if (
        (startMinutes >= bookingStart && startMinutes < bookingEnd) ||
        (endMinutes > bookingStart && endMinutes <= bookingEnd) ||
        (startMinutes <= bookingStart && endMinutes >= bookingEnd)
      ) {
        detectedConflicts.push({
          id: booking.id,
          title: booking.title,
          time: `${booking.startTime} - ${booking.endTime}`,
          status: booking.status
        });
      }
    }
    
    return detectedConflicts;
  };
  
  // 提交预订
  const submitBooking = () => {
    if (!selectedRoom || !bookingTime.start || !bookingTime.end || !meetingTitle) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    const detectedConflicts = checkConflicts();
    
    if (detectedConflicts.length > 0) {
      setConflicts(detectedConflicts);
      setShowApprovalModal(true);
      return;
    }
    
    // 创建新的预订（状态为待审批）
    const newBooking: Booking = {
      id: String(Math.floor(Math.random() * 1000)),
      roomId: selectedRoom.id,
      date: selectedDate.toISOString().split('T')[0],
      startTime: bookingTime.start,
      endTime: bookingTime.end,
      title: meetingTitle,
      status: 'pending'
    };
    
    setBookings([...bookings, newBooking]);
    Alert.alert('Success', 'Booking request submitted. Waiting for manager approval.');
    resetForm();
  };
  
  // 重置表单
  const resetForm = () => {
    setSelectedRoom(null);
    setBookingTime({ start: null, end: null });
    setMeetingTitle('');
    setAttendees('');
    setConflicts([]);
  };
  
  // 渲染会议室项
  const renderRoomItem = ({ item }: { item: MeetingRoom }) => (
    <TouchableOpacity 
      style={[
        styles.roomItem,
        selectedRoom?.id === item.id && styles.selectedRoomItem
      ]}
      onPress={() => setSelectedRoom(item)}
    >
      <Text style={styles.roomName}>{item.name}</Text>
      <Text style={styles.roomDetails}>Capacity: {item.capacity} | Location: {item.location}</Text>
    </TouchableOpacity>
  );
  
  // 时间格式化为 HH:mm
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Meeting Room</Text>
      
      {/* 日期选择 */}
      <TouchableOpacity 
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <MaterialIcons name="calendar-today" size={20} color="#3498db" />
        <Text style={styles.dateText}>
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      
      {/* 会议室列表 */}
      <FlatList
        data={meetingRooms}
        renderItem={renderRoomItem}
        keyExtractor={item => item.id}
        style={styles.roomList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      
      {selectedRoom && (
        <ScrollView style={styles.bookingForm}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          {/* 会议标题 */}
          <TextInput
            style={styles.input}
            placeholder="Meeting Title *"
            value={meetingTitle}
            onChangeText={setMeetingTitle}
          />
          
          {/* 时间选择 */}
          <View style={styles.timeContainer}>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeText}>
                {bookingTime.start ? `Start: ${formatTime(bookingTime.start)}` : 'Select Start Time'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeText}>
                {bookingTime.end ? `End: ${formatTime(bookingTime.end)}` : 'Select End Time'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* 时间选择器 */}
          {showTimePicker && (
            <View style={styles.timePickerContainer}>
              <Text style={styles.timePickerTitle}>Select Time</Text>
              
              <View style={styles.timeOptions}>
                {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      bookingTime.start === time && styles.selectedTimeOption
                    ]}
                    onPress={() => setBookingTime({...bookingTime, start: time})}
                  >
                    <Text>{formatTime(time)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.timeOptions}>
                {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      bookingTime.end === time && styles.selectedTimeOption
                    ]}
                    onPress={() => setBookingTime({...bookingTime, end: time})}
                  >
                    <Text>{formatTime(time)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.closeTimePicker}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.closeTimePickerText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* 参会人员 */}
          <TextInput
            style={styles.input}
            placeholder="Attendees (comma separated)"
            value={attendees}
            onChangeText={setAttendees}
          />
          
          {/* 冲突检测 */}
          {bookingTime.start && bookingTime.end && (
            <View style={styles.conflictContainer}>
              {conflicts.length > 0 ? (
                <Text style={styles.conflictText}>⚠️ Conflict detected with {conflicts.length} booking(s)</Text>
              ) : (
                <Text style={styles.noConflictText}>✅ No conflicts detected</Text>
              )}
            </View>
          )}
          
          {/* 提交按钮 */}
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={submitBooking}
            disabled={!meetingTitle || !bookingTime.start || !bookingTime.end}
          >
            <Text style={styles.bookButtonText}>Submit Booking Request</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      
      {/* 冲突审批模态框 */}
      <Modal
        visible={showApprovalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowApprovalModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Booking Conflict Detected</Text>
            
            <Text style={styles.modalText}>
              Your requested time conflicts with existing bookings. 
              Do you want to request manager approval?
            </Text>
            
            <FlatList
              data={conflicts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.conflictItem}>
                  <Text style={styles.conflictTitle}>{item.title}</Text>
                  <Text>{item.time} | Status: {item.status}</Text>
                </View>
              )}
              style={styles.conflictList}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowApprovalModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.approveButton]}
                onPress={() => {
                  Alert.alert('Request Sent', 'Your booking request has been sent to your manager for approval');
                  setShowApprovalModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.modalButtonText}>Request Approval</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    justifyContent: 'center',
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  roomList: {
    marginBottom: 20,
    maxHeight: 200,
  },
  roomItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedRoomItem: {
    borderWidth: 2,
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  roomDetails: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  bookingForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timePickerButton: {
    backgroundColor: '#f0f4f8',
    padding: 16,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  timePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeOption: {
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    width: '30%',
    alignItems: 'center',
  },
  selectedTimeOption: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  closeTimePicker: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeTimePickerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  conflictContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  conflictText: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  noConflictText: {
    color: '#27ae60',
    fontWeight: '600',
  },
  bookButton: {
    marginBottom: 40,
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 16,
    textAlign: 'center',
  },
  conflictList: {
    maxHeight: 150,
    marginBottom: 20,
  },
  conflictItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  conflictTitle: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  approveButton: {
    backgroundColor: '#3498db',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default BookingScreen;