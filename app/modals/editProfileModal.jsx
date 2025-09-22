import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useState } from "react";
import { ActivityIndicator, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from '../firebase';
import { useThemeContext } from "../ThemeContext";

const EditProfileModal = ({ visible, onClose, darkMode, currentName, currentPhoto, currentAge, onProfileUpdated }) => {
  // fallback to context if not provided
  const themeCtx = useThemeContext ? useThemeContext() : {};
  darkMode = darkMode !== undefined ? darkMode : themeCtx.darkMode;
  const themeColors = {
    background: darkMode ? '#111' : '#fff',
    card: darkMode ? '#222' : '#fff',
    text: darkMode ? '#fff' : '#222',
    border: darkMode ? '#333' : '#e5e5ea',
    inputBg: darkMode ? '#222' : '#f2f2f7',
    inputText: darkMode ? '#fff' : '#222',
    placeholder: darkMode ? '#888' : '#aaa',
    headerBg: darkMode ? '#222' : '#f9f9f9',
    headerText: darkMode ? '#fff' : '#222',
    button: '#007AFF',
    buttonDisabled: '#aaa',
    avatarBg: '#eee',
    avatarText: '#aaa',
    error: '#ff3b30',
    loader: '#007aff',
  };
  const [name, setName] = useState(currentName || '');
  const [age, setAge] = useState(currentAge || '');
  const [profilePhoto, setProfilePhoto] = useState(currentPhoto || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const user = auth.currentUser;
      let photoURL = user.photoURL;
      if (profilePhoto && profilePhoto !== user.photoURL) {
        // Upload new photo
        const storage = getStorage();
        const response = await fetch(profilePhoto);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL || undefined,
      });
      await user.reload();
      onProfileUpdated && onProfileUpdated({ name, age, photoURL });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: themeColors.button, fontSize: 17, padding: 12 }}>Cancel</Text>
            </TouchableOpacity>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: themeColors.headerText }}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave} disabled={loading}>
              <Text style={{ color: loading ? themeColors.buttonDisabled : themeColors.button, fontSize: 17, padding: 12 }}>{loading ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, padding: 20, paddingBottom: 100 }}>
            <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 20 }} onPress={pickImage}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={{ width: 90, height: 90, borderRadius: 45 }} />
              ) : (
                <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: themeColors.avatarBg, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: themeColors.avatarText }}>Pick Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            <TextInput
              style={{ borderWidth: 1, borderColor: themeColors.border, backgroundColor: themeColors.inputBg, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 16, color: themeColors.inputText }}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholderTextColor={themeColors.placeholder}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: themeColors.border, backgroundColor: themeColors.inputBg, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 16, color: themeColors.inputText }}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholderTextColor={themeColors.placeholder}
            />
            {error ? <Text style={{ color: themeColors.error, marginBottom: 12, textAlign: 'center', fontSize: 15 }}>{error}</Text> : null}
            {loading ? <ActivityIndicator color={themeColors.loader} style={{ marginBottom: 10 }} /> : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfileModal;
