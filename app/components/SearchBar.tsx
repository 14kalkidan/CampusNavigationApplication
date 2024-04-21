import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../styles/global';

export default function SearchBar() {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search..."
        placeholderTextColor={Colors.white}
        style={styles.searchInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    color: Colors.white,
    fontSize: 16,
  },
});
