import { useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

type LoadingStateProps = {
  message: string;
};

export default function LoadingState({ message }: LoadingStateProps) {
  const { isDarkMode } = useContext(ThemeContext);
  
  const backgroundColor = isDarkMode ? '#111827' : '#F9FAFB';
  const textColor = isDarkMode ? '#F3F4F6' : '#1F2937';
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator 
        size="large" 
        color={isDarkMode ? '#60A5FA' : '#2563EB'} 
      />
      
      <Text style={[styles.message, { color: textColor }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});