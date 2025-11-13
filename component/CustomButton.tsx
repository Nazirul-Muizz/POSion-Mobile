import { useRef, useState, useEffect } from 'react';
import { 
  Text, 
  StyleSheet, 
  Pressable, 
  Animated, 
  ViewStyle, 
  TextStyle, 
  GestureResponderEvent,
  StyleProp,
} from 'react-native';

import { ButtonColors } from '@/constants/Colors';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    onAnimationComplete? : (event: GestureResponderEvent) => void;
    //variant?: 'primary' | 'secondary'; 
    style?: StyleProp<ViewStyle>;
    textStyle?: TextStyle;
    disabled?: boolean;
};

export default function CustomButton({
    title,
    onPress, 
    onAnimationComplete, // NEW PROP
    style,
    textStyle,
    disabled = false,
}: CustomButtonProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current; // For shrinking animation
    const [isPressed, setIsPressed] = useState(false);
    const colors = ButtonColors;

    // --- Animation Handlers ---
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.98, // Shrink slightly
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    // 1. Reset state
    setIsPressed(false);
    
    // 2. Start expansion animation
    Animated.spring(scaleAnim, {
      toValue: 1, // Return to original size
      useNativeDriver: true,
      friction: 5,
    }).start(() => {
      // 3. Dynamic Execution
      if (onAnimationComplete) {
        // If a specific completion function is provided, use it.
        onAnimationComplete(event);
      } else {
        // Otherwise, fall back to the primary onPress function.
        onPress(); 
      }
    });
  };


  let passedBackgroundColor: string | undefined;
  // Safely check if the style prop contains a background color object/string
  if (style) {
      // This is a common way to handle StyleProp which can be an array, object, or number
      const styleArray = Array.isArray(style) ? style : [style];
      for (const s of styleArray) {
          if (s && typeof s === 'object' && 'backgroundColor' in s) {
              passedBackgroundColor = s.backgroundColor as string;
          }
      }
  }
  
  // --- Dynamic Styles ---
  const dynamicButtonStyles: ViewStyle = {
    // 1. Oval Shape (using large borderRadius relative to height)
    borderRadius: 50, 
    // 2. Dynamic Background Color: Use passed color if available, otherwise use default/pressed color
    backgroundColor: passedBackgroundColor
        ? (isPressed ? `${passedBackgroundColor}A0` : passedBackgroundColor) // Use custom color, slightly darker on press
        : (isPressed ? colors.pressedBackground : colors.baseBackground), // Use default colors
    // 3. Shadow
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12, // Android Shadow
  };
  
  // Apply the shrinking animation
  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  return (
    <Animated.View style={[animatedStyle, styles.animatedWrapper, { borderRadius: 50, overflow: 'hidden' }, style]}>
      <Pressable
        onPressIn={handlePressIn}
        // Changed onPressOut to handle both the animation and the onPress prop
        onPressOut={handlePressOut} 
        disabled={disabled}
        // CRITICAL CHANGE: We use the simpler onPress prop to define the default action
        onPress={onPress} 
        style={[
          styles.button, 
          dynamicButtonStyles, 
          disabled && styles.disabledButton
        ]}
      >
        <Text style={[styles.text, { color: colors.textColor }, textStyle]}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  animatedWrapper: {
    // Ensures shadow and animation scale properly
    alignSelf: 'stretch', 
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 30, // Minimum height for a good oval shape
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});