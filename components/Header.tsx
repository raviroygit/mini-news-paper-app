import { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react-native';

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  const backgroundColor = isDarkMode ? '#111827' : '#F9FAFB';
  const textColor = isDarkMode ? '#F3F4F6' : '#1F2937';
  
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        {title}
      </Text>
      
      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
        {isDarkMode ? (
          <Sun size={24} color="#F3F4F6" />
        ) : (
          <Moon size={24} color="#1F2937" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  themeToggle: {
    padding: 8,
  },
});