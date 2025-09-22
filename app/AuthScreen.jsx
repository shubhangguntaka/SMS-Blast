import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from './firebase';


export default function AuthScreen({ onAuthSuccess }) {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('Test123');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const storage = getStorage();

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

  const handleAuth = async () => {
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign up flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        let photoURL = '';
        if (profilePhoto) {
          // Upload profile photo to Firebase Storage
          const response = await fetch(profilePhoto);
          const blob = await response.blob();
          const storageRef = ref(storage, `profilePhotos/${user.uid}`);
          await uploadBytes(storageRef, blob);
          photoURL = await getDownloadURL(storageRef);
        }
        // Update Firebase Auth profile
        await updateProfile(user, {
          displayName: name,
          photoURL: photoURL || undefined,
        });
        // Reload user to ensure profile changes are available immediately
        await user.reload();
        // (No Firestore) All info is now in Auth profile only
      }
      onAuthSuccess && onAuthSuccess();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons
          name={isLogin ? 'person-circle-outline' : 'person-add-outline'}
          size={64}
          color="#007aff"
          style={{ alignSelf: 'center', marginBottom: 12 }}
        />
        <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.photoPicker} onPress={pickImage} activeOpacity={0.8}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
              ) : (
                <Text style={styles.photoPickerText}>Pick Profile Photo (optional)</Text>
              )}
            </TouchableOpacity>
          </>
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleAuth} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switch}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5ea',
    backgroundColor: '#f2f2f7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    color: '#222',
  },
  photoPicker: {
    borderWidth: 1,
    borderColor: '#e5e5ea',
    backgroundColor: '#f2f2f7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  photoPickerText: {
    color: '#aaa',
    fontSize: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007aff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.18 : 0,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  error: {
    color: '#ff3b30',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 15,
  },
  switch: {
    color: '#007aff',
    marginTop: 18,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});
