import { useContext } from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Search, Bookmark } from 'lucide-react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const { isDarkMode } = useContext(ThemeContext);
  const colorScheme = useColorScheme();
  
  // Use system theme as default
  const theme = isDarkMode !== null ? isDarkMode : colorScheme === 'dark';
  
  const activeColor = theme ? '#60A5FA' : '#2563EB';
  const inactiveColor = theme ? '#9CA3AF' : '#6B7280';
  const backgroundColor = theme ? '#1F2937' : '#FFFFFF';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopColor: theme ? '#374151' : '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color, size }) => <Bookmark size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}