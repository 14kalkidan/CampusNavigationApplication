// Firebase Push Notification Boilerplate (React Native - Combined)

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc
} from 'firebase/firestore';
import {
  getMessaging,
  getToken,
  onMessage
} from 'firebase/messaging';

// Firebase config (REPLACE with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCECQ0LpJJboELiKqicqvliJEtTsqPBV1I",
  authDomain: "notification-c3750.firebaseapp.com",
  projectId: "notification-c3750",
  storageBucket: "notification-c3750.firebasestorage.app",
  messagingSenderId: "831382274759",
  appId: "1:831382274759:web:6b63068fad01392bd5b4e2",
  measurementId: "G-916V5BGXG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const messaging = getMessaging(app);

type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: { toDate: () => Date };
  read: boolean;
};

export default function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const registerForPushNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: "BI3yXiIXtFZfWPGed1Tho-oIlgsdVrF-lIYNsoa6NMs40UjEA-ImhNePSjImJWsM5Aqi8OvufkjJ8ypLPzPGpXE"
        });
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(firestore, 'users', user.uid), {
            fcmTokens: { [token]: true }
          }, { merge: true });
        }
      }
    } catch (error) {
      console.log('Push error:', error);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        registerForPushNotifications();

        const q = query(
          collection(firestore, 'notifications'),
          where('userId', '==', user.uid)
        );

        const unsubscribeNotif = onSnapshot(q, (snapshot) => {
          const notifs: Notification[] = [];
          snapshot.forEach(doc => {
            notifs.push({
              id: doc.id,
              ...doc.data(),
            } as Notification);
          });
          setNotifications(notifs.sort((a, b) =>
            b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
          ));
        });

        return () => unsubscribeNotif();
      }
    });

    const unsubscribeForeground = onMessage(messaging, (payload) => {
      Alert.alert(payload.notification?.title || '', payload.notification?.body || '');
    });

    return () => {
      unsubscribeAuth();
      unsubscribeForeground();
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.notificationCard, !item.read && styles.unread]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.time}>{item.createdAt.toDate().toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  notificationCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: '#3a86ff'
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  body: { fontSize: 14, color: '#666', marginBottom: 8 },
  time: { fontSize: 12, color: '#999' },
  empty: {
    flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50
  }
});
