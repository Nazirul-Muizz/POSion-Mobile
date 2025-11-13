// CustomSidebar.tsx
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Modal, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from 'react';
import ConfirmPopup from './ConfirmPopup';

const screenWidth = Dimensions.get('window').width;
const sidebarWidth = screenWidth * 0.6;

interface Props {
  onClose: () => void;
}

export default function CustomSidebar({ onClose }: Props) {
    const { logout } = useAuth();
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);

    const slideAnim = useRef(new Animated.Value(-sidebarWidth)).current;

    // 2. Run animation when component mounts
    useEffect(() => {
        // Animate the position from -sidebarWidth (off-screen) to 0 (on-screen)
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300, // Duration of the slide animation
            easing: Easing.out(Easing.ease),
            useNativeDriver: true, // Use native driver for performance
        }).start();
        
        // Return a cleanup function to handle the closing animation
        return () => {
            // To ensure a smooth close animation when 'onClose' is called, 
            // you might handle the reverse animation in the parent component 
            // before unmounting, but for simplicity, we focus on the open animation here.
        };
    }, []);

    const handleLogout = () => {
        setShowConfirm(false);
        console.log('User confirmed logout');
        logout();
        router.replace('/(auth)/Register');
    };

    // --- Animation Styles ---
    const animatedSidebarStyle = {
      transform: [{ translateX: slideAnim }],
      position: 'absolute' as const, 
      left: 0,
      top: 0,
      bottom: 0,
      width: sidebarWidth, // Explicitly set the width for the animated container
    };
    
  return (
    <Modal
        visible={true}
        transparent={true} // Allows content behind to be seen (for dimming overlay)
        //animationType="slide" // Adds a nice slide-in effect
        onRequestClose={onClose} // Handles Android back button press
    >

      <TouchableWithoutFeedback onPress={onClose}>
          <SafeAreaView style={styles.overlay}>
            <Animated.View style={ animatedSidebarStyle }>
                <TouchableWithoutFeedback>
                    <View style={styles.sidebar}>
                        <Text style={styles.title}>Menu</Text>
                        <TouchableOpacity onPress={() => {}} > 
                            {/* <>TODO: Customize the Theme Preference using OnPress</> */}
                            <Text style={styles.menuItem}>Theme Preference</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowConfirm(true)} >
                            <Text style={styles.menuItem}>Logout</Text>
                        </TouchableOpacity>
                        <ConfirmPopup 
                            visible={showConfirm}
                            message='Are you sure you want to logout?'
                            onConfirm={handleLogout}
                            onCancel={() => setShowConfirm(false)}
                        />
                    </View>
                </TouchableWithoutFeedback>
              </ Animated.View>
          </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)', 
    zIndex:50
  },
  sidebar: {
    width: sidebarWidth,
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: { 
    fontSize: 22, 
    fontWeight:'bold',
    justifyContent:'flex-start',
    marginBottom: 10
  },
  menuItem: { fontSize: 16, marginVertical: 7 },
});
