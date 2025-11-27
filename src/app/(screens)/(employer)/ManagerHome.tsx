// app/home.tsx
import CustomSidebar from '@/component/CustomSidebar';
import IconFrame from "@/component/IconFrame";
import { useAuth } from '@/context/authContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { useState } from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { username } = useAuth();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <View style={{flex:1, backgroundColor:'black'}}>
        <TouchableOpacity onPress={() => setShowSidebar(true)} style={ styles.menuButton }>
            <Entypo name="menu" size={36} color="white" />
        </TouchableOpacity>
        <View style={styles.textContainer}>
            <Text style={ styles.title }>Selamat Datang {username}</Text>
            <Text style={ styles.subtitle }>Pilih tempat kerja anda</Text>
            <View style={{flexDirection:'row'}}>
                <IconFrame IconComponent={Ionicons} name='restaurant' title='Restaurant' pressButton = {() => {router.push('/(screens)/(shared)/OrderServer')}} />
                <IconFrame IconComponent={MaterialIcons} name='table-restaurant' title='Stall' pressButton = {() => {router.push('/(screens)/BlankPage')}} />
            </View>
        </View>
        {showSidebar && (
            <CustomSidebar onClose = { () => setShowSidebar(false) } />
        )}
        <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
    textContainer: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor:'white'
    },
    title: {
        fontSize:30,
        fontWeight:'bold',
        color:'black',
        marginBottom:10,
    },
    subtitle: {
        fontSize:15,
        color:'black',
        marginBottom:10,
    },
    menuButton: {
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        padding:5
    }
});
