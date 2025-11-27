import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Required for local notifications to be handled while the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true, 
    shouldShowBanner: true,
  }),
});

/**
 * Requests notification permissions from the user.
 */
export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.error('Failed to get notification permissions!');
  }
  
  // Create an Android channel if needed (best practice)
  if (Platform.OS === 'android') {
    try {
        await Notifications.setNotificationChannelAsync('new-orders', {
            name: 'New Orders',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    } catch(e) {
        console.warn("Could not set Android notification channel. This is expected in environments like Expo Go that restrict native modules.");
    }
  }
}

/**
 * Schedules a local notification with a message customized by the new order count.
 * @param count The number of new orders detected.
 */
export const scheduleNewOrderNotification = async (count: number) => {
    let title: string;
    let body: string;

    if (count === 1) {
        title = "🔔 New Order Received!";
        body = "A new customer order is waiting for preparation.";
    } else {
        title = `🚨 ${count} New Orders Arrived!`;
        body = `You have ${count} pending orders.`;
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            sound: 'default', 
            data: { newOrderCount: count },
        },
        trigger: { 
            seconds: 1, 
            channelId: 'new-orders', // Android channel ID
        },
    });
};
// --- End Notification Setup Functions ---
