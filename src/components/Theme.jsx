import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function adjustColor(color, amount) {
  if (!color || typeof color !== "string") return "#000000";
  
  try {
    return (
      "#" +
      color.replace(/^#/, "").replace(/../g, (colorMatch) => {
        const colorInt = parseInt(colorMatch, 16);
        const newColorInt = Math.min(255, Math.max(0, colorInt + amount));
        return ("0" + newColorInt.toString(16)).slice(-2);
      })
    );
  } catch (err) {
    console.warn("Error adjusting color:", err);
    return "#000000";
  }
}
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  const colors = {
    coral: "#FF7D54",
    cyan: "#3EEAFB",
    gold: "#FFC149",
    magenta: "#E45A84",
    indigo: "#6610F2",
    blue: "#0D6EFD",
    red: "#DC3545",
    emerald: "#10B981",
    purple: "#8B5CF6",
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Low": return colors.emerald;
      case "Medium": return colors.gold;
      case "High": return colors.red;
      default: return colors.blue;
    }
  };
  const theme = darkMode
    ? {
        background: "#000000",
        contentBg: "#0F0F0F",
        text: "#FFFFFF",
        subtext: "#D6D6D6",
        headerText: "#FFFFFF",
        sectionBorder: "rgba(255,255,255,0.1)",
        formBg: "#1A1A1A",
        inputBg: "#2A2A2A",
        inputBorder: "#444",
      }
    : {
        background: "#FFFFFF",
        contentBg: "#F8F9FA",
        text: "#111111",
        subtext: "#4A4A4A",
        headerText: "#111111",
        sectionBorder: "rgba(0,0,0,0.1)",
        formBg: "#F0F0F0",
        inputBg: "#FFFFFF",
        inputBorder: "#DDD",
      };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider 
      value={{ 
        darkMode, 
        toggleDarkMode, 
        theme, 
        colors, 
        getSeverityColor
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;