import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Animated, { useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function FooterCart({openCartModal, isFooterCartShown} : {openCartModal: () => void, isFooterCartShown: boolean}) {

    if (!isFooterCartShown) return;

    return (
        <View style={ styles.mainContainer }>
            <TouchableOpacity onPress={openCartModal} style={{ padding: 10, flexDirection: 'row', justifyContent:'center' }}>
                <View style={{ marginRight: 10, alignSelf:'auto' }}>
                    <AntDesign name="shopping-cart" size={27} color="black" />
                </View>

                <View style={{}}>
                    <Text style={{fontSize:18, color:"black"}}>Lihat Pesanan</Text>
                </View>

            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        backgroundColor:'white', 
        bottom: 80, 
        zIndex: 20, 
        height:'7%', 
        width: '90%', 
        position: 'absolute',
        borderWidth: 3, 
        borderColor: 'black', 
        borderRadius: 20, 
        justifyContent: 'center',
        marginHorizontal: 10
    }
})