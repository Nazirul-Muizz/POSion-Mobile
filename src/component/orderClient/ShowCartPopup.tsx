import { CartItemPopupProps } from '@/types/UiProps';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ShowCartItemPopup({
    data,
    isCartModalVisible, 
    closeCartModal,
    deleteCart
}: CartItemPopupProps) {

    if (!isCartModalVisible) return null;

    // console.log('variationSummary in popup:', JSON.stringify(data, null, 2));
    // console.log('cart in popup:', JSON.stringify(data, null, 2));
    
    return (
        <Modal
            transparent
            animationType="fade"
            visible={isCartModalVisible}            
        >
            <View style={styles.overlay}>

                <View style={styles.modalBox}>

                    <View>
                        <Text adjustsFontSizeToFit style={{fontSize:17, color:'black', marginHorizontal: 10, fontWeight:'bold', textAlign:'center'}}>Senarai Item</Text>
                    </View>
                    
                    <View style={{height:'80%', marginVertical:10 }}>
                        <FlatList 
                            data={data}
                            renderItem={({item}) => {
                                return (
                                    <View style={{marginVertical:10, marginHorizontal: 10}}>
                                        <Text style={{fontWeight:'bold', fontSize:15}}>{item.menu_item}</Text>

                                        <View style={{flexDirection: 'column'}}>
                                            <Text><Text style={{fontWeight:'bold'}}>kuantiti:</Text> {item.quantity}</Text>
                                            {item.selectedCarb !== '' && (
                                                <Text>makan dengan {item.selectedCarb}</Text>
                                            )}
                                            {item.comments.length > 0 && (
                                                <Text><Text style={{fontWeight:'bold'}}>komen:</Text> {item.comments.join(", ")}</Text>
                                            )}
                                        </View>
                                        
                                    </View>
                                )
                            }}
                            keyExtractor={(_, index) => index.toString()}

                            style={{borderWidth: 1, borderColor:'#D3D3D3', borderRadius:10}}
                        />
                    </View>

                    <View style={{justifyContent: 'flex-end', marginTop: 5, marginHorizontal:5, flexDirection:'row', gap: 5}}>

                        <TouchableOpacity onPress={deleteCart} style={[styles.button, {backgroundColor:'#e53935'}]}>
                            <Text>Buang Semua Item</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={closeCartModal} style={[styles.button, {backgroundColor:'#999'}]}>
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
        paddingHorizontal: 10, 
        borderRadius: 8, 
        //marginLeft: 10, 
        justifyContent: 'center', 
        alignSelf:'center'
    },
})