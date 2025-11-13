import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import {ROLES} from "@/constants/Roles";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { useRouter, usePathname } from "expo-router";
import { useRoute } from "@react-navigation/native";

export default function FooterNavigation() {
    const user = useAuth();
    const role = user.userRole;
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState();
    const currentRoute = useRoute();
    const pathname = usePathname();

    console.log(`user's role in FooterNavi component: ${role}`)

    console.log(`current route is ${currentRoute.name}`);

   return role === ROLES.MANAGER ? (
    <View style={styles.footer}>
        <TouchableOpacity
             onPress={() => router.replace('/Order')}
        >
            <FontAwesome6 name="rectangle-list" size={24} color="white" />
            <Text style={styles.label}>Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => router.replace('/MenuManager')}
        >
            <MaterialIcons name="menu-book" size={24} color="white" />
            <Text style={styles.label}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => router.replace('/UserProfile')}
        >
            <Feather name="user" size={24} color="white" />
            <Text style={styles.label}>Profile</Text>
        </TouchableOpacity>
    </View>
    ) : (role === ROLES.EMPLOYEE_REST || role === ROLES.EMPLOYEE_STALL) ? (
    <View style={styles.footer}>
        <TouchableOpacity
            onPress={() => router.replace('/Order')}
        >
            <FontAwesome6 name="rectangle-list" size={24} color="white" />
            <Text style={styles.label}>Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => router.replace('/UserProfile')}
        >
            <Feather name="user" size={24} color="white" />
            <Text style={styles.label}>Profile</Text>
        </TouchableOpacity>
    </View>
    ) : null;
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