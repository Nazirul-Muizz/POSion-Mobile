import { PressableIconProps } from '@/types/UiProps';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function AnimatedPressableIcon( {
    title,
    buttonName,
    IconComponent,
    handlePress,
    style,
    textStyle,
    isActive
}: PressableIconProps) {
    const scale = useSharedValue(1); 
    
    const animatedStyle = useAnimatedStyle( () => ( {
        transform: [ {scale: scale.value} ]
        } 
    ) 
    ) 
    
    useEffect( () => { 
        scale.value = withTiming(isActive ? 1 : 0.8, { duration: 200 }); 
    }, [isActive])

    return (
        <Pressable onPress={handlePress}>
            <Animated.View style={animatedStyle}>
                <IconComponent name={buttonName} size={35} color="black" style={[style, isActive ? styles.active : styles.inactive]}/>
                <Text style={[textStyle, isActive ? styles.active : styles.inactive]}>{title}</Text>
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    active: {
        color:'#4CAF50',
    },
    inactive: {
        color:'black'
    }
})


