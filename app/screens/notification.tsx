// screens/NotificationsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

// Types
type Notification = {
  id: string;
  title: string;
  message: string;
  details?: string;
  read: boolean;
  createdAt: string;
};

// Mock data - replace with real API calls
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Message',
    message: 'You have received a new message from John',
    details: 'Meeting scheduled for tomorrow at 2 PM. Please bring your project updates.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
  },
  {
    id: '2',
    title: 'System Update',
    message: 'New app version available',
    details: 'Version 2.3.0 includes bug fixes and performance improvements.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load notifications
  const loadNotifications = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
    } catch (error) {
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mark as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Handle notification press
  const handlePress = (notification: Notification) => {
    if (!notification.read) markAsRead(notification.id);
    setSelectedNotification(notification);
  };

  // Setup push notifications
  useEffect(() => {
    const setupNotifications = async () => {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission denied');
      }

      // Handle notification taps when app is in background/quit
      Notifications.addNotificationResponseReceivedListener(response => {
        const notification = response.notification.request.content.data as Notification;
        setSelectedNotification(notification);
      });
    };

    setupNotifications();
    loadNotifications();
  }, []);

  // Show notification count badge
  const unreadCount = notifications.filter(n => !n.read).length;

  // Render list item
  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={[
        styles.notificationItem,
        item.read ? styles.readItem : styles.unreadItem
      ]}
    >
      <Ionicons
        name={item.read ? 'notifications-outline' : 'notifications'}
        size={24}
        color={item.read ? '#666' : '#0066cc'}
      />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemMessage} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.itemTime}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  // Render detail view
  const renderDetail = () => (
    <View style={styles.detailContainer}>
      <TouchableOpacity 
        onPress={() => setSelectedNotification(null)}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#0066cc" />
        <Text style={styles.backText}>Back to notifications</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.detailContent}>
        <View style={styles.detailHeader}>
          <Ionicons name="notifications" size={32} color="#0066cc" />
          <Text style={styles.detailTitle}>{selectedNotification?.title}</Text>
          <Text style={styles.detailTime}>
            {selectedNotification?.createdAt && new Date(selectedNotification.createdAt).toLocaleString()}
          </Text>
        </View>

        <Text style={styles.detailMessage}>{selectedNotification?.message}</Text>

        {selectedNotification?.details && (
          <View style={styles.detailsBox}>
            <Text style={styles.detailsText}>{selectedNotification.details}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  // Main render
  return (
    <View style={styles.container}>
      {selectedNotification ? (
        renderDetail()
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator style={styles.loader} size="large" color="#0066cc" />
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="notifications-off" size={48} color="#999" />
                  <Text style={styles.emptyText}>No notifications yet</Text>
                </View>
              }
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadNotifications();
              }}
            />
          )}
        </>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadItem: {
    backgroundColor: '#f8faff',
    borderLeftWidth: 3,
    borderLeftColor: '#0066cc',
  },
  readItem: {
    backgroundColor: '#fff',
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  itemTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  itemMessage: {
    color: '#666',
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 12,
    color: '#999',
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    color: '#999',
  },
  detailContainer: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backText: {
    marginLeft: 8,
    color: '#0066cc',
  },
  detailContent: {
    padding: 16,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
    color: '#333',
  },
  detailTime: {
    fontSize: 14,
    color: '#999',
  },
  detailMessage: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: '#333',
  },
  detailsBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  detailsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
});