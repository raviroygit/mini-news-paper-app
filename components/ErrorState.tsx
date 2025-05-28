import { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { WifiOff } from 'lucide-react-native';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { isDarkMode } = useContext(ThemeContext);
  
  const textColor = isDarkMode ? '#F3F4F6' : '#1F2937';
  const buttonBgColor = isDarkMode ? '#60A5FA' : '#2563EB';
  
  return (
    <View style={styles.container}>
      <WifiOff size={64} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
      
      <Text style={[styles.message, { color: textColor }]}>
        {message}
      </Text>
      
      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: buttonBgColor }]}
          onPress={onRetry}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: 300,
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});