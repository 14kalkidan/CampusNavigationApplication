import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const GoBackButton = () => {
  const navigation = useNavigation();
  const routes = useNavigationState(state => state.routes);
  const routeIndex = useNavigationState(state => state.index);

  const handleGoBack = () => {
    if (navigation.canGoBack() && routeIndex > 0) {
      navigation.goBack();
    } else {
      navigation.navigate('(tabs)', { screen: 'PreviousScreen' });
    }
  };

  return (
    <TouchableOpacity onPress={handleGoBack} style={styles.button}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});

export default GoBackButton;