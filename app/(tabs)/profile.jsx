import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, RowItem, SwitchRow } from "react-native-ios-kit";
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '../firebase';
import AboutModal from '../modals/aboutModal';
import EditProfileModal from '../modals/editProfileModal';
import ManageAccount from '../modals/manageAccountModal';
import { useThemeContext } from "../ThemeContext";

const Profile = ({ darkMode, setDarkMode }) => {
  // If darkMode/setDarkMode are not passed, fallback to context (for future-proofing)
  const themeCtx = useThemeContext ? useThemeContext() : {};
  darkMode = darkMode !== undefined ? darkMode : themeCtx.darkMode;
  setDarkMode = setDarkMode !== undefined ? setDarkMode : themeCtx.setDarkMode;
  const themeColors = {
    background: darkMode ? '#111' : '#fff',
    card: darkMode ? '#222' : '#f9f9f9',
    text: darkMode ? '#fff' : '#222',
    border: '#eee',
    modalOverlay: 'rgba(0,0,0,0.2)',
    modalContent: darkMode ? '#222' : '#fff',
    buttonCancelBg: '#f0f4ff',
    buttonLogoutBg: '#ffeaea',
    buttonCancelText: '#007AFF',
    buttonLogoutText: '#FF3B30',
    sectionTitle: darkMode ? '#fff' : '#333',
    avatarBorder: '#eee',
    aboutText: darkMode ? '#aaa' : '#666',
    placeholder: darkMode ? '#888' : '#aaa',
  };
  const [manageModal, setManageModal] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userAge, setUserAge] = useState('');
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);

  useEffect(() => {
    // Listen for auth state changes to always get the latest user info
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || '');
        setProfilePhoto(user.photoURL || null);
        // Try to get age from displayName if stored as 'Name|Age'
        if (user.displayName && user.displayName.includes('|')) {
          const [name, age] = user.displayName.split('|');
          setUserName(name.trim());
          setUserAge(age ? age.trim() : '');
        }
      } else {
        setUserName('');
        setProfilePhoto(null);
        setUserAge('');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Custom iOS-style header */}
      <View style={{ paddingTop: 48, paddingBottom: 16, alignItems: 'center', backgroundColor: themeColors.card }}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: themeColors.text }}>{userName ? userName : 'Profile'}</Text>
      </View>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={styles.avatarContainer}>
          {profilePhoto ? (
            <Avatar source={{ uri: profilePhoto }} size={100} />
          ) : (
            <Avatar initials={userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'PR'} size={100} />
          )}
          {userName ? (
            <Text style={{ marginTop: 10, fontSize: 18, fontWeight: '600', color: themeColors.text }}>{userName}</Text>
          ) : null}
        </View>
        <View style={[styles.optionsContainer, { backgroundColor: themeColors.card, shadowColor: darkMode ? '#000' : '#000' }]}>
          <SwitchRow
            title="Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
            style={styles.row}
          />
          <RowItem
            title="Edit Profile Details"
            onPress={() => setEditProfileModal(true)}
            icon="create-outline"
            iconFamily="Ionicons"
            rightComponent={() => <Icon name="chevron-forward-outline" size={22} color={themeColors.text} />}
            style={styles.row}
          />
          {/* Edit Profile Modal */}
          <EditProfileModal
            visible={editProfileModal}
            onClose={() => setEditProfileModal(false)}
            darkMode={darkMode}
            currentName={userName}
            currentPhoto={profilePhoto}
            currentAge={userAge}
            onProfileUpdated={({ name, age, photoURL }) => {
              setUserName(name);
              setUserAge(age);
              setProfilePhoto(photoURL);
              // Save age in displayName as 'Name|Age' (since Auth has no age field)
              const user = auth.currentUser;
              if (user) {
                user.updateProfile({ displayName: `${name}${age ? '|' + age : ''}` });
              }
            }}
          />
          <RowItem
            title="Manage Account"
            onPress={() => setManageModal(true)}
            icon="settings-outline"
            iconFamily="Ionicons"
            rightComponent={() => <Icon name="chevron-forward-outline" size={22} color={themeColors.text} />}
            style={styles.row}
          />
          <RowItem
            title="About"
            onPress={() => setAboutModal(true)}
            icon="information-circle-outline"
            iconFamily="Ionicons"
            rightComponent={() => <Icon name="chevron-forward-outline" size={22} color={themeColors.text} />}
            style={styles.row}
          />
          {/* About Modal */}
          <AboutModal
            visible={aboutModal}
            onClose={() => setAboutModal(false)}
            darkMode={darkMode}
          />
          <RowItem
            title={<Text style={{ color: themeColors.buttonLogoutText }}>Log Out</Text>}
            onPress={() => setShowLogoutModal(true)}
            icon="log-out-outline"
            iconFamily="Ionicons"
            iconProps={{ color: themeColors.buttonLogoutText }}
            style={styles.row}
          />
        </View>
        {/* Logout Confirm Modal */}
        <Modal
          visible={showLogoutModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={[styles.modalOverlay, { backgroundColor: themeColors.modalOverlay }]}>
            <View style={[styles.modalContent, { backgroundColor: themeColors.modalContent, alignItems: 'center', padding: 24 }]}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: themeColors.text }}>Confirm Logout</Text>
              <Text style={{ fontSize: 16, color: themeColors.aboutText, marginBottom: 24 }}>Are you sure you want to log out?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <TouchableOpacity
                  onPress={() => setShowLogoutModal(false)}
                  style={{ flex: 1, marginRight: 8, paddingVertical: 12, borderRadius: 8, backgroundColor: themeColors.buttonCancelBg, alignItems: 'center' }}
                >
                  <Text style={{ color: themeColors.buttonCancelText, fontSize: 16, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      await signOut(auth);
                      setShowLogoutModal(false);
                    } catch (e) {
                      alert('Logout failed: ' + e.message);
                    }
                  }}
                  style={{ flex: 1, marginLeft: 8, paddingVertical: 12, borderRadius: 8, backgroundColor: themeColors.buttonLogoutBg, alignItems: 'center' }}
                >
                  <Text style={{ color: themeColors.buttonLogoutText, fontSize: 16, fontWeight: '600' }}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Manage Account Modal */}
        <ManageAccount
          visible={manageModal}
          onClose={() => setManageModal(false)}
          darkMode={darkMode}
          changePassword={changePassword}
          setChangePassword={setChangePassword}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 32,
    backgroundColor: "transparent",
    minHeight: '100%',
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#eee",
    marginBottom: 8,
  },
  optionsContainer: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 24,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  backText: {
    color: '#007AFF',
    fontSize: 17,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
});

export default Profile;
