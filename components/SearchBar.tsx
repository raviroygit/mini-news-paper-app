import { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const { isDarkMode } = useContext(ThemeContext);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    await onSearch(query);
    setIsSearching(false);
  };
  
  const clearSearch = () => {
    setQuery('');
  };
  
  const backgroundColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  const textColor = isDarkMode ? '#F3F4F6' : '#1F2937';
  const placeholderColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const iconColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  
  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, { backgroundColor }]}>
        <Search size={20} color={iconColor} />
        
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="Search for news..."
          placeholderTextColor={placeholderColor}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />
        
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <X size={20} color={iconColor} />
          </TouchableOpacity>
        )}
        
        {isSearching && (
          <ActivityIndicator 
            size="small" 
            color={isDarkMode ? '#60A5FA' : '#2563EB'} 
            style={styles.loader}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  loader: {
    marginLeft: 8,
  },
});