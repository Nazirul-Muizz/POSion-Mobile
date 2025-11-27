import Entypo from '@expo/vector-icons/Entypo';
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MainTemplatepProps {
    title: string,
    children?: React.ReactNode
}

export default function MainTemplate({children, title}: MainTemplatepProps) {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <View style={{ flex:1, backgroundColor:'black' }}>
            <View style={{ flexDirection:'row', backgroundColor:'black', marginHorizontal:10}} >
                <TouchableOpacity onPress={() => setShowSidebar(true)} style={ styles.menuButton }>
                    <Entypo name="menu" size={36} color="white" />
                </TouchableOpacity>
            <Text style={ styles.title }>{title}</Text>
            </View>
                {children}
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