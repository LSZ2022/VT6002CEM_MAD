import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// 定义导航参数类型
type RootStackParamList = {
  MainTabs: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function LoginPage() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    // 这里可以添加实际的登录逻辑
    // 登录成功后导航到主页面
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>CompanyPortal Login</Text>

      {/* 用戶名輸入框 */}
      <View style={[
        styles.inputContainer,
        isFocused.email && styles.inputFocused
      ]}>
        <MaterialIcons 
          name="person" 
          size={20} 
          color={isFocused.email ? '#3498db' : '#95a5a6'} 
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#95a5a6"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsFocused({...isFocused, email: true})}
          onBlur={() => setIsFocused({...isFocused, email: false})}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* 密碼輸入框 */}
      <View style={[
        styles.inputContainer,
        isFocused.password && styles.inputFocused
      ]}>
        <MaterialIcons 
          name="lock" 
          size={20} 
          color={isFocused.password ? '#3498db' : '#95a5a6'} 
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#95a5a6"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          onFocus={() => setIsFocused({...isFocused, password: true})}
          onBlur={() => setIsFocused({...isFocused, password: false})}
        />
        <TouchableOpacity onPress={toggleShowPassword} style={styles.passwordToggle}>
          <MaterialIcons 
            name={showPassword ? 'visibility' : 'visibility-off'} 
            size={20} 
            color="#95a5a6" 
          />
        </TouchableOpacity>
      </View>

      {/* 提交按鈕 */}
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6fa',
    padding: 30,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#3498db',
    shadowColor: '#3498db',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#2c3e50',
  },
  passwordToggle: {
    padding: 8,
  },
  loginButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#3498db',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 25,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  fingerprintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  fingerprintButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  footerText: {
    marginTop: 30,
    color: '#7f8c8d',
    fontSize: 14,
  },
});