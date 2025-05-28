import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Create{'\n'}Account</Text>

      {/* Cute Image and Hello Text */}
      <View style={styles.imageRow}>
        <Image
          source={require('@/assets/images/signin.png')} // Replace with your image
          style={styles.image}
        />
        <Text style={styles.helloText}>Hello</Text>
      </View>

      {/* Input Fields */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="UserName"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.passwordRow}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setSecureText(!secureText)}
        >
          <Ionicons name={secureText ? 'eye-off' : 'eye'} size={20} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordRow}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureConfirm}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setSecureConfirm(!secureConfirm)}
        >
          <Ionicons name={secureConfirm ? 'eye-off' : 'eye'} size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInBtn}>
        <Text style={styles.signInText}>SignIn</Text>
      </TouchableOpacity>

      {/* Already Have Account */}
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={{ color: 'blue' }} onPress={() => router.push('/Authentication/signin')}>
          LogIn
        </Text>
      </Text>

      {/* Google Sign In */}
      <TouchableOpacity style={styles.googleBtn}>
        <Ionicons name="logo-google" size={20} color="#4285F4" />
        <Text style={styles.googleText}>Sign in using Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  backBtn: {
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  helloText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  passwordRow: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 14,
  },
  signInBtn: {
    backgroundColor: '#2979FF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  signInText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  googleBtn: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleText: {
    color: '#4285F4',
    fontWeight: '600',
  },
});
