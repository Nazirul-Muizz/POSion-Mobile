import { View, StyleSheet, Text, Animated, TouchableOpacity } from "react-native";
import CustomButton from "@/component/CustomButton";
import CustomSidebar from "@/component/CustomSidebar";
import { menu, addOns } from "@/data/menu";
import { useState, useEffect } from "react";
import Entypo from '@expo/vector-icons/Entypo';


export default function MainTemplate() {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <View style={{ flex:1, backgroundColor:'black' }}>
            <View style={{ flexDirection:'row', backgroundColor:'black', marginHorizontal:10}} >
                <TouchableOpacity onPress={() => setShowSidebar(true)} style={ styles.menuButton }>
                    <Entypo name="menu" size={36} color="white" />
                </TouchableOpacity>
            <Text style={ styles.title }>Menu Management</Text>
            </View>
            <View style={{ flex:1, backgroundColor: 'white'}}>

            </View>
            {showSidebar && (
                <CustomSidebar onClose = { () => setShowSidebar(false) } />
            )}
        </View> 
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize:17,
        fontWeight:'bold',
        color:'white',
        marginHorizontal:60,
        padding: 10

    },
     menuButton: {
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        padding:5
    },
});