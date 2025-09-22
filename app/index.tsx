
import React, { useState } from "react";
import { View } from "react-native";
import { TabBar } from 'react-native-ios-kit';
import History from "./(tabs)/history";
import Home from "./(tabs)/home";
import Profile from "./(tabs)/profile";
import { ThemeContextProvider, useThemeContext } from "./ThemeContext";


function MainApp() {
  const [activeTab, setActiveTab] = useState(0);
  const { darkMode, setDarkMode } = useThemeContext();
  const tabs = [
    {
      icon: activeTab === 0 ? 'home' : 'home-outline',
      title: 'Home',
      onPress: () => setActiveTab(0),
      isActive: activeTab === 0,
    },
    {
      icon: activeTab === 1 ? 'time' : 'time-outline',
      title: 'History',
      onPress: () => setActiveTab(1),
      isActive: activeTab === 1,
      //disabled: true,
    },
    {
      icon: activeTab === 2 ? 'person' : 'person-outline',
      title: 'Profile',
      onPress: () => setActiveTab(2),
      isActive: activeTab === 2,
    },
  ];
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {activeTab === 0 && <Home />}
        {activeTab === 1 && <History />}
        {activeTab === 2 && <Profile darkMode={darkMode} setDarkMode={setDarkMode} />}
      </View>
      <TabBar tabs={tabs} />
    </View>
  );
}

export default function Index() {
  return (
    <ThemeContextProvider>
      <MainApp />
    </ThemeContextProvider>
  );
}
