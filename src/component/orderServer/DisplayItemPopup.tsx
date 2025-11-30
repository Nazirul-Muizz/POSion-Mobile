import { useOrderItemQuery } from '@/hooks/orderServerHooks';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DisplayItemPopup = ({
    visible,
    orderId,
    onClose
}: {visible: boolean, orderId: string, onClose: () => void}) => {
    const orderItems = useOrderItemQuery(orderId);

    console.log('Order items in DisplayItemPopup: ', JSON.stringify(orderItems, null, 2));

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={ styles.overlay }>
            
                <View style={ styles.modalBox }>

                    <View>
                        <Text style={ styles.modalTitle}>Senarai Item</Text>
                    </View>

                    <View style={{marginVertical:10 }}>
                        <FlatList
                            data={orderItems}
                            keyExtractor={item => item.menu_id.toString()}
                            renderItem={({item}) => {
                                const comments = (item.comment && Array.isArray(item.comment) && item.comment.length > 0)
                                    ? item.comment
                                    : null;

                                return (
                                    <View style={{marginVertical:10, marginHorizontal: 10}}>
                                        <Text style={{fontWeight:'bold', fontSize:15}}>{item.item_name}</Text>

                                        <View style={{flexDirection: 'column'}}>
                                            <Text><Text style={{fontWeight:'bold'}}>kuantiti:</Text> {item.quantity}</Text>
                                            {item.carb !== '' && (
                                                <Text>makan dengan {item.carb}</Text>
                                            )}
                                            {comments && (
                                                <Text>
                                                    <Text style={{ fontWeight: 'bold' }}>komen:</Text> {comments.join(", ")}
                                                </Text>
                                            )}
                                        </View>
                                        
                                    </View>
                                )}
                            }
                            
                            style={{borderWidth: 1, borderColor:'#D3D3D3', borderRadius:10}}
                        />
                    </View>
    
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.button, styles.cancelButton]}
                        >
                            <Text style={styles.buttonText}>Tutup</Text>
                        </TouchableOpacity>
        
                    </View>
    
                </View>
    
            </View>
        </Modal>
    )
}

export default DisplayItemPopup

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
  },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 10,
        color: 'black' 
    },
    modalBody: {

    },
    buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10, padding:10, gap: 5 },
    button: {borderRadius: 8, marginLeft: 10, padding: 10 },
    cancelButton: { backgroundColor: 'gray' },
    buttonText: { color: '#fff', fontSize: 13 },
});