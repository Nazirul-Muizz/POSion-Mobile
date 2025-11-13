import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { JSX } from "react";
import { useAuth } from "@/context/authContext";
import {ROLES} from "@/constants/Roles";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";

type Page = {
    label: string;
    icon: JSX.Element;
    path: '/Order' | '/MenuManager' | '/UserProfile';
}

export default function FooterNavigation() {
    const router = useRouter();
    const { userRole, isRoleLoading } = useAuth();

    if (isRoleLoading || !userRole) return null;


    const rolePages = {
        [ROLES.MANAGER]: [
            { label: 'Order', icon: <FontAwesome6 name="rectangle-list" size={24} color="white" />, path: '/Order' },
            { label: 'Menu', icon: <MaterialIcons name="menu-book" size={24} color="white" />, path: '/MenuManager' },
            { label: 'Profile', icon: <Feather name="user" size={24} color="white" />, path: '/UserProfile' },
        ],
        [ROLES.EMPLOYEE_REST]: [
            { label: 'Order', icon: <FontAwesome6 name="rectangle-list" size={24} color="white" />, path: '/Order' },
            { label: 'Profile', icon: <Feather name="user" size={24} color="white" />, path: '/UserProfile' },
        ],
        [ROLES.EMPLOYEE_STALL]: [
            { label: 'Order', icon: <FontAwesome6 name="rectangle-list" size={24} color="white" />, path: '/Order' },
            { label: 'Profile', icon: <Feather name="user" size={24} color="white" />, path: '/UserProfile' },
        ],
    };

    const pages = rolePages[userRole] ?? [];

    return pages.length === 0 ? null : (
    <View style={styles.footer}>
        {pages.map((page) => (
        <TouchableOpacity key={page.label} onPress={() => router.replace(page.path as Page["path"])}>
            {page.icon}
            <Text style={styles.label}>{page.label}</Text>
        </TouchableOpacity>
        ))}
    </View>
    );

}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  label: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  iconActive: {

  },
  iconInactive: {

  }
});