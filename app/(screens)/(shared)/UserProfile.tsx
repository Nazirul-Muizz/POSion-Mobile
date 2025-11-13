import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";
import { profile } from "@/data/users";
import Entypo from '@expo/vector-icons/Entypo';
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import CustomSidebar from "@/component/CustomSidebar";

export default function UserProfile() {
    const {user, userRole} = useAuth();
    const userName = user?.name;
    const userEmail = user?.email;
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <View style={{ flex:1, backgroundColor:'black' }}>
            <View style={{ flexDirection:'row', backgroundColor:'black', marginHorizontal:10}} >
                <TouchableOpacity onPress={() => setShowSidebar(true)} style={ styles.menuButton }>
                    <Entypo name="menu" size={36} color="white" />
                </TouchableOpacity>
            <Text style={ styles.title }>User Profile</Text>
            </View>
            <View style={{ flex:1, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
                <Entypo name="user" size={200} color="black" style={ styles.iconFrame }/>
                <Text style={ styles.text }>Name: {userName}</Text>
                <Text style={ styles.text }>Email: {userEmail}</Text>
                <Text style={ styles.text }>Role: {userRole}</Text>
            </View>
            {showSidebar && (
                <CustomSidebar onClose = { () => setShowSidebar(false) } />
            )}
            <StatusBar />
        </View>
    )
}

const styles = StyleSheet.create({
    menuButton: {
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        padding:5
    },
    iconFrame: {
        width: 210,
        height: 210,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
        marginBottom:20,
    },
    title: {
        fontSize:17,
        fontWeight:'bold',
        color:'white',
        marginHorizontal:60,
        padding: 10

    },
    text: {
        fontSize:20,
        fontWeight: 'condensed'
    }
})