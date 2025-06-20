import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types';

type HelpCenterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HelpCenter'>;

interface HelpCenterScreenProps {
  navigation: HelpCenterScreenNavigationProp;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ContactMethod {
  icon: string;
  name: string;
  value: string;
}

const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ navigation }) => {
const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the Settings screen and select "Change Password". Follow the instructions to verify your identity and set a new password.'
    },
    {
      question: 'How can I update my profile information?',
      answer: 'Navigate to your Profile screen and tap on any field you wish to update. After making changes, remember to tap the "Save Changes" button at the bottom.'
    },
    {
      question: 'Why am I not receiving notifications?',
      answer: 'Ensure notifications are enabled in your device settings and in the app Settings under "Notifications". Also check that your internet connection is stable.'
    },
    {
      question: 'How do I contact support?',
      answer: 'You can contact our support team by emailing support@companyportal.com or calling +1 (800) 123-4567 during business hours (9am-5pm EST).'
    },
    {
      question: 'How can I change my department information?',
      answer: 'Department information can only be updated by your HR administrator. Please contact your HR department for any changes to your organizational details.'
    }
  ];

  const contactMethods = [
    { icon: 'email', name: 'Email Support', value: 'support@companyportal.com' },
    { icon: 'phone', name: 'Call Support', value: '+1 (800) 123-4567' },
    { icon: 'chat', name: 'Live Chat', value: 'Available 9am-5pm EST' },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqQuestion} 
                  onPress={() => toggleFAQ(index)}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Icon 
                    name={activeIndex === index ? 'expand-less' : 'expand-more'} 
                    size={24} 
                    color="#3498db" 
                  />
                </TouchableOpacity>
                {activeIndex === index && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.contactCard}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.contactItem, index !== contactMethods.length - 1 && styles.contactBorder]}
              >
                <View style={styles.contactLeft}>
                  <Icon name={method.icon} size={24} color="#3498db" style={styles.contactIcon} />
                  <View>
                    <Text style={styles.contactName}>{method.name}</Text>
                    <Text style={styles.contactValue}>{method.value}</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color="#bdc3c7" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  faqContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#f8f9fa',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  contactBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    marginRight: 16,
  },
  contactName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  contactValue: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
});

export default HelpCenterScreen;