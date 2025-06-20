import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Image
} from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode-svg';

const AttendanceScreen = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'generate'>('scan');
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrData, setQrData] = useState('');
  const [faceDetected, setFaceDetected] = useState(false);
  const [livenessCheckPassed, setLivenessCheckPassed] = useState(false);
  const cameraRef = useRef<Camera>(null);

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');

  // Check camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Camera Permission Required', 'Please allow app to access camera');
        }
      } else if (!hasPermission) {
        await requestPermission();
      }
    };

    checkPermissions();
  }, [hasPermission, requestPermission]);

  // Generate QR code data
  const generateQR = () => {
    setIsProcessing(true);

    // User data
    const userData = {
      userId: "EMP20240616",
      name: "John Doe",
      department: "R&D Department",
      timestamp: new Date().toISOString()
    };

    // Convert to JSON string
    const qrContent = JSON.stringify(userData);

    setQrData(qrContent);
    setIsProcessing(false);
  };

  // Simulate liveness check API call
  const performLivenessCheck = async () => {
    try {
      setIsProcessing(true);
      setFaceDetected(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate API response - 80% success rate
      const success = Math.random() > 0.2;

      if (success) {
        setLivenessCheckPassed(true);
        Alert.alert('Verification Passed', 'Liveness check successful!');

        // Generate QR code
        generateQR();

        // Switch to QR code tab
        setTimeout(() => {
          setActiveTab('generate');
        }, 300);
      } else {
        setLivenessCheckPassed(false);
        Alert.alert('Verification Failed', 'Please ensure good lighting and face the camera directly');
      }
    } catch (error) {
      Alert.alert('Error', 'Liveness check service unavailable');
      console.error('Liveness check error:', error);
    } finally {
      setFaceDetected(false);
      setIsProcessing(false);
    }
  };

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera not supported or permission denied</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     

      {activeTab === 'scan' ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="face" size={24} color="#3498db" />
            <Text style={styles.cardTitle}>Face Verification</Text>
          </View>
          
          <View style={styles.cameraContainer}>
            {hasPermission ? (
              <>
                <Camera
                  ref={cameraRef}
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive={true}
                  torch="off"
                  photo={false}
                  video={false}
                  audio={false}
                />

                <View style={styles.faceOverlay}>
                  <View style={[
                    styles.faceCircle,
                    { borderColor: faceDetected ? '#2ecc71' : '#3498db' }
                  ]} />
                </View>
              </>
            ) : (
              <View style={styles.permissionDenied}>
                <Icon name="camera-off" size={48} color="#95a5a6" />
                <Text style={styles.permissionText}>Camera permission required</Text>
              </View>
            )}
          </View>

          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              {faceDetected ? 'Processing...' : 'Position face within circle'}
            </Text>
            <Text style={styles.subInstructionText}>
              {faceDetected ? 'Hold still...' : 'Ensure good lighting conditions'}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.detectButton,
              faceDetected && styles.detectingButton
            ]}
            onPress={performLivenessCheck}
            disabled={faceDetected}
          >
            {faceDetected ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Icon name="camera" size={20} color="white" />
                <Text style={styles.detectButtonText}>Start Verification</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="qr-code" size={24} color="#3498db" />
            <Text style={styles.cardTitle}>Attendance QR Code</Text>
          </View>
          
          {isProcessing ? (
            <View style={styles.qrLoading}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.qrLoadingText}>Generating...</Text>
            </View>
          ) : qrData ? (
            <View style={styles.qrContent}>
              <View style={styles.userInfo}>
                <View style={styles.avatar} />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>John Doe</Text>
                  <Text style={styles.userDepartment}>R&D Department | EMP20240616</Text>
                </View>
              </View>
              
              <View style={styles.qrCodeContainer}>
                <QRCode value={qrData} size={200} />
                <Text style={styles.qrHint}>Valid for 5 minutes</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyQR}>
              <Icon name="info-outline" size={48} color="#bdc3c7" />
              <Text style={styles.emptyQRText}>Complete face verification first</Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setActiveTab('scan')}
              >
                <Text style={styles.backButtonText}>Back to Verification</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Status indicator */}
      <View style={styles.statusBar}>
        <View style={styles.statusIndicator}>
          {livenessCheckPassed ? (
            <>
              <Icon name="check-circle" size={20} color="#2ecc71" />
              <Text style={styles.statusTextSuccess}>Verification successful</Text>
            </>
          ) : (
            <>
              <Icon name="warning" size={20} color="#f39c12" />
              <Text style={styles.statusTextWarning}>Face verification required</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 10,
  },
  cameraContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionDenied: {
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: '#95a5a6',
    marginTop: 10,
  },
  faceOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    backgroundColor: 'transparent',
  },
  instructionContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  subInstructionText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 5,
  },
  detectButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  detectingButton: {
    backgroundColor: '#f39c12',
  },
  detectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  qrLoading: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrLoadingText: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 15,
  },
  qrContent: {
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    marginRight: 15,
  },
  userDetails: {
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userDepartment: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  qrCodeContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  qrHint: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 15,
    fontStyle: 'italic',
  },
  emptyQR: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyQRText: {
    fontSize: 18,
    color: '#95a5a6',
    marginTop: 15,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#3498db',
    fontWeight: '500',
  },
  statusBar: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextSuccess: {
    fontSize: 16,
    fontWeight: '500',
    color: '#27ae60',
    marginLeft: 8,
  },
  statusTextWarning: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f39c12',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default AttendanceScreen;