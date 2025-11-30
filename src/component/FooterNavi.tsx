import { ROLES } from "@/constants/Roles";
import { useAuth } from "@/context/authContext";
import { PageProps } from "@/types/UiProps";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function FooterNavigation() {
    const router = useRouter();
    const { userRole, isRoleLoading } = useAuth();

    if (isRoleLoading || !userRole) return null;

    const rolePages = {
        [ROLES.MANAGER]: [
            { label: 'List Order', icon: <FontAwesome6 name="rectangle-list" style={styles.icon}/>, path: '/OrderServer' },
            { label: 'Tambah Order', icon: <Entypo name="add-to-list" style={styles.icon}/>, path: '/OrderClient' },
            { label: 'Edit Menu', icon: <MaterialIcons name="menu-book" style={styles.icon}/>, path: '/MenuManager' },
            { label: 'Profile', icon: <Feather name="user" style={styles.icon}/>, path: '/UserProfile' },
        ],
        [ROLES.EMPLOYEE_REST]: [
            { label: 'List Order', icon: <FontAwesome6 name="rectangle-list" style={styles.icon}/>, path: '/OrderServer' },
            { label: 'Tambah Order', icon: <Entypo name="add-to-list" style={styles.icon}/>, path: '/OrderClient' },
            { label: 'Profile', icon: <Feather name="user" style={styles.icon}/>, path: '/UserProfile' },
        ],
        [ROLES.EMPLOYEE_STALL]: [
            { label: 'Order', icon: <FontAwesome6 name="rectangle-list" style={styles.icon}/>, path: '/OrderServer' },
            { label: 'Profile', icon: <Feather name="user" style={styles.icon}/>, path: '/UserProfile' },
        ],
    };

    const pages = rolePages[userRole] ?? [];

    return pages.length === 0 ? null : (
    <View style={styles.footer}>
        {pages.map((page) => (
            <View style={ styles.menuFooter } key={page.label}>
                <TouchableOpacity key={page.label} onPress={() => router.replace(page.path as PageProps["path"])} >
                    {page.icon}
                    <Text style={styles.label}>{page.label}</Text>
                </TouchableOpacity>
            </View>
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
    backgroundColor: 'white',
    flexDirection: 'row',
    zIndex: 10,
    elevation: 10,
  },
  label: {
    color: "#333",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  iconActive: {

  },
  iconInactive: {

  },
  menuFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  icon: { 
    alignSelf: 'center',
    fontSize: 24,
    color: '#333'
}
});