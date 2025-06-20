import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid,
  Modal,
  ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

// 定义类型
type ItemStatus = 'Available' | 'Loaned' | 'Under Repair';
type RecordStatus = 'Active' | 'Overdue' | 'Returned';

type InventoryItem = {
  id: string;
  name: string;
  barcode: string;
  status: ItemStatus;
  location: string;
  lastScan: string;
};

type LoanRecord = {
  id: string;
  itemId: string;
  borrower: string;
  date: string;
  dueDate: string;
  status: RecordStatus;
};

const InventoryScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loanRecords, setLoanRecords] = useState<LoanRecord[]>([]);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'not-determined'>('not-determined');
  const [isLoading, setIsLoading] = useState(false);

  // 获取相机设备
  const device = useCameraDevice('back');

  // 库存物品数据
  const inventoryItems: InventoryItem[] = [
    { id: '1', name: 'Laptop', barcode: '123456789', status: 'Available', location: 'IT Dept', lastScan: '2025-06-15' },
    { id: '2', name: 'Projector', barcode: '987654321', status: 'Loaned', location: 'Meeting Room B', lastScan: '2025-06-10' },
    { id: '3', name: 'Camera', barcode: '456789123', status: 'Available', location: 'Marketing', lastScan: '2025-06-18' },
    { id: '4', name: 'Tablet', barcode: '789123456', status: 'Under Repair', location: 'Tech Support', lastScan: '2025-06-12' },
    { id: '5', name: 'VR Headset', barcode: '321654987', status: 'Available', location: 'R&D Lab', lastScan: '2025-06-17' },
  ];

  const mockinventoryItems: InventoryItem[] = [
    { id: '6', name: 'Laptop', barcode: '123456789', status: 'Available', location: 'IT Dept', lastScan: '2025-06-15' },
  ];

  // 借出记录数据
  const initialLoanRecords: LoanRecord[] = [
    { id: '101', itemId: '2', borrower: 'Alice', date: '2025-06-15', dueDate: '2025-06-22', status: 'Active' },
    { id: '102', itemId: '4', borrower: 'Bob', date: '2025-06-10', dueDate: '2025-06-17', status: 'Overdue' },
    { id: '103', itemId: '3', borrower: 'Charlie', date: '2025-05-20', dueDate: '2025-06-05', status: 'Returned' },
  ];

  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(inventoryItems);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [borrower, setBorrower] = useState('');
  const [dueDate, setDueDate] = useState('');

  // 初始化借出记录
  useEffect(() => {
    setLoanRecords(initialLoanRecords);
  }, []);

  // 搜索物品
  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode.includes(searchQuery) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  // 检查相机权限
  useEffect(() => {
    const checkCameraPermission = async () => {
      const permission = await Camera.getCameraPermissionStatus();
      setCameraPermission(permission);
    };

    checkCameraPermission();
  }, []);

  // 处理扫描结果
  const handleBarcodeScanned = (barcode: string) => {
    // 根据条形码查找物品
    const scannedItem = items.find(item => item.barcode === barcode);

    if (scannedItem) {
  // Update scan time
  const updatedItems = items.map(item =>
    item.id === scannedItem.id ? {
      ...item,
      lastScan: new Date().toISOString().split('T')[0]
    } : item
  );

  setItems(updatedItems);
  setFilteredItems(updatedItems);
  setSelectedItem(scannedItem);
  Alert.alert('Item Scanned', `Name: ${scannedItem.name}\nStatus: ${scannedItem.status}`);
} else {
  Alert.alert('Not Found', 'This item is not in the inventory');
}


    // 关闭扫描界面
    setScanning(false);
  };

  // 条形码扫描配置
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'], // 支持的条形码类型
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const scannedCode = codes[0].value;
        if (scannedCode) {
          handleBarcodeScanned(scannedCode);
        }
      }
    }
  });

  // 启动扫描
  const startBarcodeScan = async () => {
    setIsLoading(true);

    // Check camera permission
    let permissionStatus = cameraPermission;
    if (cameraPermission === 'not-determined') {
      permissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(permissionStatus);
    }

    if (permissionStatus !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to use the scanning feature',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      setIsLoading(false);
      return;
    }

    // Check if there is an available camera device
    if (!device) {
      Alert.alert('Error', 'No available camera device');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setScanning(true);
  };


  // 借出物品
  const loanItem = () => {
    // Check if required fields are filled
    if (!selectedItem || !borrower || !dueDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Update the status of the selected item to 'Loaned'
    const updatedItems: InventoryItem[] = items.map(item =>
      item.id === selectedItem.id ? {
        ...item,
        status: 'Loaned' as ItemStatus
      } : item
    );

    // Update the state with the updated items list
    setItems(updatedItems);
    setFilteredItems(updatedItems);

    // Create a new loan record
    const newLoanRecord: LoanRecord = {
      id: String(Math.floor(Math.random() * 1000)), // Generate a random ID
      itemId: selectedItem.id,
      borrower: borrower,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      dueDate: dueDate,
      status: 'Active'
    };

    // Add the new loan record to the loan records state
    setLoanRecords([...loanRecords, newLoanRecord]);

    // Show success alert
    Alert.alert('Success', `${selectedItem.name} has been loaned to ${borrower}`);

    // Reset form and state variables
    setShowLoanForm(false);
    setSelectedItem(null);
    setBorrower('');
    setDueDate('');
  };

  // 归还物品
  const returnItem = (itemId: string) => {
    // 更新物品状态
    const updatedItems: InventoryItem[] = items.map(item =>
      item.id === itemId ? {
        ...item,
        status: 'Available' as ItemStatus
      } : item
    );

    setItems(updatedItems);
    setFilteredItems(updatedItems);

    // 更新借出记录
    const updatedRecords: LoanRecord[] = loanRecords.map(record =>
      record.itemId === itemId ? {
        ...record,
        status: 'Returned' as RecordStatus
      } : record
    );

    setLoanRecords(updatedRecords);

    Alert.alert('Success', 'The item has been returned');
  };

  // 报告物品问题
  const reportItemIssue = (itemId: string) => {
    const updatedItems: InventoryItem[] = items.map(item =>
      item.id === itemId ? {
        ...item,
        status: 'Under Repair' as ItemStatus
      } : item
    );

    setItems(updatedItems);
    setFilteredItems(updatedItems);
    Alert.alert('Reported', 'Item marked as under repair');
  };

  // 渲染库存物品
  const renderItem = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        selectedItem?.id === item.id && styles.selectedItem
      ]}
      onPress={() => setSelectedItem(item)}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={[
          styles.itemStatus,
          item.status === 'Available' && styles.statusAvailable,
          item.status === 'Loaned' && styles.statusLoaned,
          item.status === 'Under Repair' && styles.statusRepair,
        ]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.itemBarcode}>Barcode: {item.barcode}</Text>
      <Text style={styles.itemLocation}>Location: {item.location}</Text>
      <Text style={styles.itemScan}>Last Scan: {item.lastScan}</Text>
    </TouchableOpacity>

  );

  // 渲染借出记录
  const renderLoanRecord = ({ item }: { item: LoanRecord }) => {
    const inventoryItem = items.find(i => i.id === item.itemId);

    return (
      <View style={styles.loanCard}>
        <View style={styles.loanHeader}>
          <Text style={styles.loanItemName}>{inventoryItem?.name || 'Unknown Item'}</Text>
          <Text style={[
            styles.loanStatus,
            item.status === 'Active' && styles.statusActive,
            item.status === 'Overdue' && styles.statusOverdue,
            item.status === 'Returned' && styles.statusReturned,
          ]}>
            {item.status}
          </Text>
        </View>
        <Text>Borrower: {item.borrower}</Text>
        <Text>Loan Date: {item.date}</Text>
        <Text>Return Date: {item.dueDate}</Text>

        {item.status === 'Active' && (
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => returnItem(item.itemId)}
          >
            <Text style={styles.returnButtonText}>Mark as Returned</Text>
          </TouchableOpacity>
        )}
      </View>

    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Management</Text>

      {/* 搜索框 */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 扫描按钮 */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={startBarcodeScan}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <MaterialIcons name="qr-code-scanner" size={24} color="white" />
            <Text style={styles.scanButtonText}>Scan barcode</Text>
          </>
        )}
      </TouchableOpacity>

      {/* 扫描界面模态框 */}
      <Modal
        visible={scanning}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setScanning(false)}
      >
        <View style={{ flex: 1 }}>
          {device && (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={scanning}
              codeScanner={codeScanner}
            />
          )}

          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>Place the barcode inside the frame to scan.</Text>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setScanning(false)}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 库存物品列表 */}
      <Text style={styles.sectionTitle}>Stock Items</Text>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.itemList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {selectedItem && !showLoanForm && (
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowLoanForm(true)}
            disabled={selectedItem.status !== 'Available'}
          >
            <Text style={styles.actionButtonText}>Borrow Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.reportButton]}
            onPress={() => reportItemIssue(selectedItem.id)}
          >
            <Text style={styles.actionButtonText}>Report Issue</Text>
          </TouchableOpacity>

        </View>
      )}

      {/* 借出表单 */}
      {showLoanForm && selectedItem && (
        <View style={styles.loanForm}>
          <Text style={styles.formTitle}>Lending Item: {selectedItem.name}</Text>

          <TextInput
            style={styles.formInput}
            placeholder="Borrower's Name *"
            value={borrower}
            onChangeText={setBorrower}
          />

          <TextInput
            style={styles.formInput}
            placeholder="Return Date (YYYY-MM-DD) *"
            value={dueDate}
            onChangeText={setDueDate}
            keyboardType="numeric"
          />


          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => setShowLoanForm(false)}
            >
              <Text style={styles.formButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.formButton, styles.confirmButton]}
              onPress={loanItem}
            >
              <Text style={styles.formButtonText}>Confirm loan</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 借出记录 */}
      <Text style={styles.sectionTitle}>Loan Records</Text>
      <FlatList
        data={loanRecords}
        renderItem={renderLoanRecord}
        keyExtractor={item => item.id}
        style={styles.loanList}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    elevation: 2,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  manualInputButton: {
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  manualInputText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    marginTop: 16,
  },
  itemList: {
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedItem: {
    borderColor: '#3498db',
    borderWidth: 2,
    backgroundColor: '#e3f2fd',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  itemStatus: {
    fontWeight: '600',
    fontSize: 14,
  },
  statusAvailable: {
    color: '#27ae60',
  },
  statusLoaned: {
    color: '#e74c3c',
  },
  statusRepair: {
    color: '#f39c12',
  },
  itemBarcode: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  itemScan: {
    fontSize: 12,
    color: '#bdc3c7',
    fontStyle: 'italic',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  reportButton: {
    backgroundColor: '#f39c12',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loanForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2c3e50',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#27ae60',
  },
  formButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loanList: {
    marginBottom: 16,
  },
  loanCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  loanItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  loanStatus: {
    fontWeight: '600',
  },
  statusActive: {
    color: '#3498db',
  },
  statusOverdue: {
    color: '#e74c3c',
  },
  statusReturned: {
    color: '#27ae60',
  },
  returnButton: {
    backgroundColor: '#27ae60',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  // 扫描界面样式
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scannerFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  scannerText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InventoryScreen;