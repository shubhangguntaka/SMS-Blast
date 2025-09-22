import color from "color";
import React, { createContext, useContext, useState } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "react-native-ios-kit";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode
    ? {
        ...DarkTheme,
        barColor: "#000",
        primaryColor: "#007AFF", // iOS blue
        primaryLightColor: color("#007AFF").lighten(0.2).hex(),
        backgroundColor: "#000",
        textColor: "#fff",
      }
    : {
        ...DefaultTheme,
        barColor: "#fff",
        primaryColor: "#007AFF", // iOS blue
        primaryLightColor: color("#007AFF").lighten(0.2).hex(),
        backgroundColor: "#fff",
        textColor: "#222",
      };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default ThemeContextProvider;
