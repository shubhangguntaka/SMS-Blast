import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Button, RowItem } from "react-native-ios-kit";
import { useThemeContext } from "../ThemeContext";
import Icon from 'react-native-vector-icons/Ionicons';

const ManageAccount = ({
  visible,
  onClose,
  darkMode,
  changePassword,
  setChangePassword,
}) => {
  const themeCtx = useThemeContext ? useThemeContext() : {};
  darkMode = darkMode !== undefined ? darkMode : themeCtx.darkMode;
  const themeColors = {
    background: darkMode ? '#111' : '#fff',
    card: darkMode ? '#222' : '#fff',
    text: darkMode ? '#fff' : '#222',
    border: darkMode ? '#333' : '#eee',
    headerBg: darkMode ? '#222' : '#f9f9f9',
    headerText: darkMode ? '#fff' : '#222',
    button: '#007AFF',
    buttonDelete: '#FF3B30',
    sectionTitle: darkMode ? '#fff' : '#333',
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={{ flex: 1, backgroundColor: themeColors.background, justifyContent: 'center' }}>
        <View
          style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: themeColors.background, borderRadius: 0, width: '100%', alignSelf: 'center', marginTop: 0, marginBottom: 0 }}
        >
          {/* Modal header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: themeColors.border, backgroundColor: themeColors.headerBg }}>
            <TouchableOpacity onPress={() => {
              if (changePassword) setChangePassword(false);
              else onClose();
            }}>
              <Text style={{ color: themeColors.button, fontSize: 17, padding: 12 }}>Back</Text>
            </TouchableOpacity>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: themeColors.headerText }}>{changePassword ? 'Change Password' : 'Manage Account'}</Text>
            <View style={{ width: 60 }} />
          </View>
          {!changePassword ? (
            <View>
              <RowItem
                title="Change Password"
                onPress={() => setChangePassword(true)}
                rightComponent={() => <Icon name="chevron-forward-outline" size={22} color={themeColors.text} />}
                style={{ borderBottomWidth: 1, borderBottomColor: themeColors.border }}
              />
              <RowItem
                title={<Text style={{ color: themeColors.buttonDelete, fontWeight: '600' }}>Delete Account</Text>}
                onPress={() => { }}
                rightComponent={() => <Icon name="chevron-forward-outline" size={22} color={themeColors.text} />}
                style={{ borderBottomWidth: 1, borderBottomColor: themeColors.border }}
              />
            </View>
          ) : (
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: themeColors.sectionTitle }}>Change Password</Text>
              {/* Add your change password form here */}
              <Button inline inverted title="Submit" onPress={() => setChangePassword(false)} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default ManageAccount;
