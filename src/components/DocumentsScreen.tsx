import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type DocumentsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Documents'>;

const DocumentsScreen = () => {
  const navigation = useNavigation<DocumentsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<'personal' | 'shared'>('personal');
  
  // 文件數據
  const personalFiles = [
    { id: '1', name: 'Quarterly Report.pdf', type: 'pdf', size: '2.4 MB', date: '2025-05-10' },
    { id: '2', name: 'Project Proposal.docx', type: 'doc', size: '1.2 MB', date: '2025-05-08' },
    { id: '3', name: 'Design Draft.fig', type: 'fig', size: '5.7 MB', date: '2025-05-05' },
    { id: '4', name: 'Budget Sheet.xlsx', type: 'xls', size: '0.8 MB', date: '2025-05-01' },
  ];
  
  const sharedFiles = [
    { id: '5', name: 'Company Policy Manual.pdf', type: 'pdf', size: '3.1 MB', date: '2025-04-28' },
    { id: '6', name: 'Team Resources.zip', type: 'zip', size: '12.4 MB', date: '2025-04-25' },
    { id: '7', name: 'Meeting Minutes.docx', type: 'doc', size: '0.9 MB', date: '2025-04-20' },
  ];


  const getFileIcon = (type: string) => {
    const icons = {
      pdf: 'picture-as-pdf',
      doc: 'description',
      xls: 'grid-on',
      fig: 'image',
      zip: 'folder-zip',
      default: 'insert-drive-file'
    };
    
    return icons[type as keyof typeof icons] || icons.default;
  };

  const getFileColor = (type: string) => {
    const colors = {
      pdf: '#e74c3c',
      doc: '#3498db',
      xls: '#2ecc71',
      fig: '#9b59b6',
      zip: '#f39c12',
      default: '#95a5a6'
    };
    
    return colors[type as keyof typeof colors] || colors.default;
  };

  const renderFileItem = ({ item }: { item: typeof personalFiles[0] }) => (
    <TouchableOpacity style={styles.fileCard}>
      <View style={styles.fileIconContainer}>
        <Icon 
          name={getFileIcon(item.type)} 
          size={28} 
          color={getFileColor(item.type)} 
        />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.fileMeta}>
          <Text style={styles.fileSize}>{item.size}</Text>
          <Text style={styles.fileDate}>{item.date}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="more-vert" size={24} color="#bdc3c7" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* 標題欄 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={28} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Documents</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={28} color="#2c3e50" />
          </TouchableOpacity>
        </View>

        {/* 分類標籤 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'personal' && styles.activeTab]}
            onPress={() => setActiveTab('personal')}
          >
            <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
              My Documents
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'shared' && styles.activeTab]}
            onPress={() => setActiveTab('shared')}
          >
            <Text style={[styles.tabText, activeTab === 'shared' && styles.activeTabText]}>
              Shared Documents
            </Text>
          </TouchableOpacity>
        </View>

        {/* 文件列表 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'personal' ? 'My Documents' : 'Team Shared Documents'}
          </Text>
          <Text style={styles.fileCount}>
            {activeTab === 'personal' ? personalFiles.length : sharedFiles.length} document(s)
          </Text>
        </View>

        <FlatList
          data={activeTab === 'personal' ? personalFiles : sharedFiles}
          renderItem={renderFileItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.fileList}
        />

        {/* 新增文件按鈕 */}
        <TouchableOpacity style={styles.addFloatingButton}>
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>
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
    marginBottom: 25,
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
  searchButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#edf2f7',
    borderRadius: 12,
    padding: 5,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '700',
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
  fileCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  fileList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fileIconContainer: {
    marginRight: 15,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  fileMeta: {
    flexDirection: 'row',
  },
  fileSize: {
    fontSize: 13,
    color: '#95a5a6',
    marginRight: 15,
  },
  fileDate: {
    fontSize: 13,
    color: '#95a5a6',
  },
  moreButton: {
    padding: 5,
  },
  addFloatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default DocumentsScreen;