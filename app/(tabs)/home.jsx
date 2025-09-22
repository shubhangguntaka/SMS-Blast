import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SwitchRow } from "react-native-ios-kit";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useThemeContext } from "../ThemeContext";

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const Home = () => {
    const { darkMode } = useThemeContext();
    const [mobile, setMobile] = useState("");
    const [count, setCount] = useState("");
    const [notificationPermission, setNotificationPermission] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            setNotificationPermission(status === 'granted');
        })();
    }, []);

    // Ensure count is always between 1 and 500 and numeric
    const handleCountChange = (val) => {
        let num = val.replace(/[^0-9]/g, "");
        if (num === "") num = "1";
        let n = Math.max(1, Math.min(500, parseInt(num, 10)));
        setCount(n.toString());
    };

    const handleSliderChange = (val) => {
        setCount(Math.round(val).toString());
    };

    const handleSubmit = async () => {
        if (!mobile.trim() || !count.trim()) {
            alert('Please fill the details');
            return;
        }
        let title = 'Info', body = 'Connecting to backend...';
        let sentCount = 0;
        try {
            const response = await fetch('http://localhost:5000/send-sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    number: mobile,
                    times: count,
                    speed: 1000 // ms between requests, adjust as needed
                })
            });
            const data = await response.json();
            if (response.ok && !data.error) {
                title = 'Success';
                body = data.message || 'SMS sent!';
                sentCount = parseInt(count, 10);
            } else {
                title = 'Failed';
                body = data.message || 'Failed to send SMS';
            }
        } catch (err) {
            title = 'Error';
            body = 'Error connecting to backend';
        }
        // Save to AsyncStorage history
        try {
            const historyKey = 'smsHistory';
            const historyRaw = await AsyncStorage.getItem(historyKey);
            let history = [];
            if (historyRaw) {
                history = JSON.parse(historyRaw);
            }
            const now = Date.now();
            const newEntry = {
                id: now,
                author: 'You',
                mobile,
                content: `Sent to ${count} numbers.`,
                sent: sentCount,
                total: parseInt(count, 10),
                customMessage: customMessageEnabled ? customMessage : null,
            };
            history.unshift(newEntry);
            await AsyncStorage.setItem(historyKey, JSON.stringify(history));
        } catch (err) {}
        // Show notification
        if (notificationPermission) {
            await Notifications.scheduleNotificationAsync({
                content: { title, body },
                trigger: null,
            });
        } else {
            alert(body);
        }
    };

    const [customMessageEnabled, setCustomMessageEnabled] = useState(false);
    const [customMessage, setCustomMessage] = useState("");

    // Theme-based colors
    const themeColors = {
        background: darkMode ? '#111' : '#fff',
        card: darkMode ? '#222' : '#fff',
        text: darkMode ? '#fff' : '#333',
        inputBg: darkMode ? '#222' : '#f9f9f9',
        inputText: darkMode ? '#fff' : '#111',
        border: darkMode ? '#333' : '#e5e5ea',
        sliderThumb: '#007AFF',
        sliderTrack: darkMode ? '#444' : '#e5e5ea',
        iconInactive: darkMode ? '#888' : '#aaa',
        iconActive: '#007AFF',
        buttonBg: darkMode ? '#333' : '#fff',
        placeholder: darkMode ? '#888' : '#aaa',
    };
    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.text, { color: themeColors.text }]}>Welcome to SMS Blast! 💥</Text>
            <View style={[styles.card, { backgroundColor: themeColors.card, shadowColor: darkMode ? '#000' : '#000' }]}>
                <Text style={{ marginBottom: 4, fontWeight: '500', color: themeColors.text }}>Mobile Number</Text>
                <TextInput
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={setMobile}
                    maxLength={15}
                    style={[styles.inputIOS, { backgroundColor: themeColors.inputBg, color: themeColors.inputText, borderColor: themeColors.border }]}
                    placeholderTextColor={themeColors.placeholder}
                />
                <Text style={{ marginBottom: 4, fontWeight: '500', color: themeColors.text }}>Number of SMS</Text>
                <TextInput
                    placeholder="Number of SMS"
                    keyboardType="numeric"
                    value={count}
                    onChangeText={handleCountChange}
                    maxLength={3}
                    style={[styles.inputIOS, { backgroundColor: themeColors.inputBg, color: themeColors.inputText, borderColor: themeColors.border }]}
                    placeholderTextColor={themeColors.placeholder}
                />
                <View style={styles.sliderRow}>
                    <Icon name="thumbs-down" size={22} color={themeColors.iconInactive} style={{ marginRight: 8 }} />
                    <Slider
                        minimumValue={1}
                        maximumValue={500}
                        step={1}
                        value={parseInt(count) || 1}
                        onValueChange={handleSliderChange}
                        minimumTrackTintColor={themeColors.sliderThumb}
                        maximumTrackTintColor={themeColors.sliderTrack}
                        thumbTintColor={themeColors.sliderThumb}
                        style={{ flex: 1, marginHorizontal: 4, marginBottom: 18, alignContent: 'center', justifyContent: 'center' }}
                    />
                    <Icon name="thumbs-up" size={22} color={themeColors.iconActive} style={{ marginLeft: 8 }} />
                </View>
                <SwitchRow
                    title="Custom Message"
                    value={customMessageEnabled}
                    onValueChange={setCustomMessageEnabled}
                    style={styles.row}
                />
                {customMessageEnabled && (
                    <TextInput
                        placeholder="Enter your custom message here"
                        keyboardType="default"
                        value={customMessage}
                        onChangeText={setCustomMessage}
                        multiline={true}
                        numberOfLines={4}
                        style={[styles.inputIOS, { backgroundColor: themeColors.inputBg, color: themeColors.inputText, borderColor: themeColors.border }]}
                        placeholderTextColor={themeColors.placeholder}
                    />
                )}
                <View style={styles.buttonIOS}>
                    <Button
                        title="Send SMS 💥"
                        onPress={handleSubmit}
                        color={themeColors.sliderThumb}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 24,
    },
    card: {
        width: "100%",
        maxWidth: 350,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'stretch',
    },
    inputIOS: {
        borderColor: '#e5e5ea',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 18,
        backgroundColor: '#f9f9f9',
        fontSize: 17,
        color: '#111',
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row: {
        borderBottomWidth: 1,
    },
    buttonIOS: {
        marginTop: 8,
        borderRadius: 10,
        overflow: 'hidden',
    },
});

export default Home;