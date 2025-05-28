import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return {
    isDark: colorScheme === 'dark',
    colors: {
      background: colorScheme === 'dark' ? '#000' : '#fff',
      text: colorScheme === 'dark' ? '#fff' : '#000',
    },
  };
};