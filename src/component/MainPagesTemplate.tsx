import Entypo from '@expo/vector-icons/Entypo';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomSidebar from './CustomSidebar';

interface MainTemplatepProps {
    title: string,
    children?: React.ReactNode
    openSidebar: (isTrue: boolean) => void
    sidebar: boolean
}

export default function MainTemplate({children, title, openSidebar, sidebar}: MainTemplatepProps) {

    return (
        <View style={{ flex:1, backgroundColor:'black' }}>
            <View style={{ flexDirection:'row', backgroundColor:'black', justifyContent:'space-between', alignContent:'flex-start'}} >
                <View>
                    <TouchableOpacity onPress={() => openSidebar(true)} style={ styles.menuButton }>
                        <Entypo name="menu" size={36} color="white" />
                    </TouchableOpacity>
                </View>
                
                <View>
                    <Text style={ styles.title }>{title}</Text>
                </View>
                
                <View style={ styles.spacer }></View>

            </View>
                {children}
            {sidebar && (
                <CustomSidebar
                    onClose={() => openSidebar(false)}
                />)}
        </View> 
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize:17,
        fontWeight:'bold',
        color:'white',
        padding: 10,

    },
     menuButton: {
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        padding:5,
    },
    spacer: {
        width:'15%'//spacer
    }
});