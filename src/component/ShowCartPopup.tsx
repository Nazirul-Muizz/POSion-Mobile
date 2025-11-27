import { CartItem } from '@/types/OrderType';
import { FlatList, ListRenderItemInfo, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ShowCartItemPopup({
    cart,
    isCartModalVisible, 
    closeCartModal
}: {
    cart: CartItem[], 
    isCartModalVisible: boolean, 
    closeCartModal: () => void
}) {

    if (!isCartModalVisible) return null;
    
    return (
        <Modal
            transparent
            animationType="fade"
            visible={isCartModalVisible}            
        >
            <View style={styles.overlay}>

                <View style={styles.modalBox}>

                    <View style={{}}>
                        <Text adjustsFontSizeToFit style={{fontSize:17, color:'black', marginHorizontal: 10, fontWeight:'bold', textAlign:'center'}}>Senarai Item</Text>
                    </View>
                    
                    <View style={{height:'80%', marginVertical:10 }}>
                        <FlatList 
                            data={cart}
                            renderItem={({item}: ListRenderItemInfo<CartItem>) => {
                                return (
                                    <View style={{marginVertical:10, marginHorizontal: 10}}>
                                        <Text>{item.menu_item}</Text>

                                        <View style={{flexDirection: 'column'}}>
                                            <Text>kuantiti: {item.quantity}</Text>
                                            {item.comment !== '' && (
                                                <Text>{item.comment}</Text>
                                            )}
                                            {item.selectedCarb !== '' && (
                                                <Text>makan dengan {item.selectedCarb}</Text>
                                            )}
                                        </View>
                                        
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.menu_id.toString()}

                            style={{borderWidth: 1, borderColor:'#D3D3D3', borderRadius:10}}
                        />
                    </View>

                    <View style={{justifyContent: 'flex-end', marginTop: 5}}>
                        <TouchableOpacity onPress={closeCartModal} style={styles.button}>
                            <Text>Tutup</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

        </Modal>
  )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
        maxHeight:'80%'
    },
    button: { 
        paddingVertical: 10,
        paddingHorizontal: 20, 
        borderRadius: 8, 
        //marginLeft: 10, 
        backgroundColor: '#999',
        justifyContent: 'center', 
        alignSelf:'center'
    },
})