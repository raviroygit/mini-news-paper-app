import { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Newspaper as NewspaperIcon } from 'lucide-react-native';

type EmptyStateProps = {
  message: string;
  subMessage?: string;
};

export default function EmptyState({ message, subMessage }: EmptyStateProps) {
  const { isDarkMode } = useContext(ThemeContext);
  
  const textColor = isDarkMode ? '#F3F4F6' : '#1F2937';
  const secondaryTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const iconColor = isDarkMode ? '#374151' : '#E5E7EB';
  
  return (
    <View style={styles.container}>
      <NewspaperIcon size={64} color={iconColor} />
      
      <Text style={[styles.message, { color: textColor }]}>
        {message}
      </Text>
      
      {subMessage && (
        <Text style={[styles.subMessage, { color: secondaryTextColor }]}>
          {subMessage}
        </Text>
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
  },
  subMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});