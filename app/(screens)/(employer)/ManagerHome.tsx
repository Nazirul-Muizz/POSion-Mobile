// app/home.tsx
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useState } from "react";
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconFrame  from "@/component/IconFrame";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import CustomSidebar from '@/component/CustomSidebar';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <View style={{flex:1, backgroundColor:'black'}}>
        <TouchableOpacity onPress={() => setShowSidebar(true)} style={ styles.menuButton }>
            <Entypo name="menu" size={36} color="white" />
        </TouchableOpacity>
        <View style={styles.textContainer}>
            <Text style={ styles.title }>Welcome {user?.name}</Text>
            <Text style={ styles.subtitle }>Choose your workplace</Text>
            <View style={{flexDirection:'row'}}>
                <IconFrame IconComponent={Ionicons} name='restaurant' title='Restaurant' pressButton = {() => {router.push('/(screens)/(shared)/Order')}} />
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
