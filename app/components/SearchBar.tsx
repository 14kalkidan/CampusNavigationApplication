import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: any;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFocus,
  onBlur,
  style,
  placeholder = 'Search for places...',
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    onSearch(trimmed);
  }, [query, onSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <View style={[styles.container, style]}>
      <MaterialIcons name="search" size={20} color="#666" style={styles.leftIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        onFocus={onFocus}
        onBlur={onBlur}
        accessibilityLabel={placeholder}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.rightIcon}>
          <MaterialIcons name="clear" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 48,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default SearchBar;
