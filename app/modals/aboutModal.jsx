
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { NavigationRow } from "react-native-ios-kit";

const APP_NAME = "SMS Blast";
const VERSION = "1.0.0";
const MADE_WITH = "❤️ Shubhang";

const AboutModal = ({ visible, onClose, darkMode }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={{ flex: 1, backgroundColor: darkMode ? '#111' : '#fff' }}>
        {/* Modal header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: darkMode ? '#222' : '#f9f9f9' }}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: '#007AFF', fontSize: 17, padding: 12 }}>Close</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: darkMode ? '#fff' : '#222' }}>About</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 24, paddingBottom: 120 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8, color: darkMode ? '#fff' : '#222', textAlign: 'center' }}>{APP_NAME}</Text>
          <Text style={{ fontSize: 16, color: darkMode ? '#aaa' : '#555', marginBottom: 24, textAlign: 'center' }}>
            SMS Blast is a simple and efficient app for sending bulk SMS messages quickly and securely. Built for productivity and ease of use, it leverages modern mobile technologies to streamline your communication needs.
          </Text>
        </ScrollView>
        {/* Sticky bottom info */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 16, backgroundColor: darkMode ? '#111' : '#fff', alignItems: 'center' }}>
          <View style={{ width: '100%', backgroundColor: darkMode ? '#222' : '#f9f9f9', borderRadius: 16, padding: 8, marginBottom: 8 }}>
            <NavigationRow
              title="Version"
              onPress={() => alert('Version: V1.0.0')}
              info="V1.0.0"
            />
            <NavigationRow
              title="Made for"
              onPress={() => alert('Prank Friends')}
              info="Prank Friends"
            />
          </View>
          <Text style={{ fontSize: 14, color: darkMode ? '#888' : '#888', textAlign: 'center', marginTop: 4 }}>
            © {new Date().getFullYear()} SHUBHANG. All rights reserved.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default AboutModal;
