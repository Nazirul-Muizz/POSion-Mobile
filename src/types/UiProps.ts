import type { IconProps } from '@expo/vector-icons/build/createIconSet';
import { JSX } from "react";
import { GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { CartItem } from './OrderType';

export type PopupProps = {
    message:string,
    visible: boolean,
    onConfirm?: () => void,
    onCancel: () => void,
}

export interface CustomButtonProps {
    title: string;
    onPress?: () => void;
    onAnimationComplete? : (event?: GestureResponderEvent) => void; 
    style?: StyleProp<ViewStyle>;
    textStyle?: TextStyle;
    disabled?: boolean;
};

export interface DropdownProps {
  id: string
  data: string[],
  initialState: string,
}

export interface SidebarProps {
  onClose: () => void;
  children?: React.ReactNode;
}

export type FooterCartProps = {
    openCartModal: () => void; 
    isFooterCartShown: boolean
}

export type PageProps = {
    label: string;
    icon: JSX.Element;
    path: '/OrderServer' | '/MenuManager' | '/UserProfile' | '/OrderClient';
}

export interface PressableIconProps {
    title: string;
    IconComponent: React.ComponentType<IconProps<any>>;
    handlePress: () => void;
    style?: StyleProp<TextStyle>;
    buttonName: string;
    textStyle: TextStyle,
    isActive: boolean;
}

export interface CartItemPopupProps {
    data: CartItem[],
    isCartModalVisible: boolean, 
    closeCartModal: () => void,
    deleteCart: () => void
}