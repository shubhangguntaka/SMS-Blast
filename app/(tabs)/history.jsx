
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, ProgressBar } from 'react-native-paper';
import { useThemeContext } from "../ThemeContext";

const History = () => {
    const { darkMode } = useThemeContext();
    const themeColors = {
        background: darkMode ? '#111' : '#fff',
        text: darkMode ? '#fff' : '#333',
        card: darkMode ? '#222' : '#f9f9f9',
    };
    const [smsHistory, setSmsHistory] = useState([]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const historyRaw = await AsyncStorage.getItem('smsHistory');
                if (historyRaw) {
                    setSmsHistory(JSON.parse(historyRaw));
                } else {
                    setSmsHistory([]);
                }
            } catch (err) {
                setSmsHistory([]);
            }
        };
        const unsubscribe = loadHistory;
        loadHistory();
        // Optionally, add event listeners for navigation focus to reload
        return () => { };
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: themeColors.background }}>
            {/* Custom iOS-style header */}
            <View style={{ paddingTop: 48, paddingBottom: 16, alignItems: 'center', backgroundColor: themeColors.card }}>
                <Text style={{ fontSize: 22, fontWeight: '600', color: themeColors.text }}>History</Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {smsHistory.length === 0 ? (
                    <Text style={{ color: themeColors.text, textAlign: 'center', marginTop: 32 }}>No SMS Blast history yet.</Text>
                ) : (
                    smsHistory.map(({ id, author, mobile, content, sent, total, customMessage }) => (
                        <Card
                            key={id}
                            style={[styles.card, { backgroundColor: themeColors.card, borderColor: darkMode ? '#333' : '#e5e5ea', borderWidth: 1 }]}
                        >
                            <Card.Content>
                                <View style={styles.dateNauthor}>
                                    <Text style={[styles.date, { color: darkMode ? '#bbb' : '#888' }]}>{new Date(id).toLocaleDateString()}</Text>
                                    <Text style={[styles.author, { color: darkMode ? '#bbb' : '#888' }]}> • {author}</Text>
                                </View>
                                <Text style={[styles.title, { color: darkMode ? '#fff' : '#222' }]}>To: {mobile}</Text>
                                <Text style={[styles.content, { color: darkMode ? '#eee' : '#333' }]}>Requested: {total} messages</Text>
                                {customMessage ? (
                                    <Text style={[styles.customMessage, { color: darkMode ? '#4da3ff' : '#007AFF' }]}>Custom Message: {customMessage}</Text>
                                ) : null}
                                <View style={{ marginTop: 10 }}>
                                    <ProgressBar
                                        progress={total === 0 ? 0 : sent / total}
                                        color={darkMode ? '#4da3ff' : '#007AFF'}
                                        style={{ height: 8, borderRadius: 4, backgroundColor: darkMode ? '#222' : '#e5e5ea' }}
                                    />
                                    <Text style={[styles.progressText, { color: darkMode ? '#bbb' : '#888' }]}>{sent} / {total} sent</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default History;

const styles = StyleSheet.create({
    card: {
        marginBottom: 18,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    dateNauthor: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    date: {
        fontSize: 13,
        color: '#888',
    },
    author: {
        fontSize: 13,
        color: '#888',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#222',
    },
    content: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
    },
    customMessage: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 4,
    },
    progressText: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
        marginBottom: 2,
        textAlign: 'right',
    },
});