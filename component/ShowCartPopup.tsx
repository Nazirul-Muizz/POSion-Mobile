import { Modal, StyleSheet, Text, View } from 'react-native';

export default function ShowCartItemPopup() {
  return (
    <Modal
        transparent
        animationType="fade"
        visible
        //onRequestClose={onCancel}
    >
        <View style={styles.overlay}>

            <View style={styles.modalBox}>

                <View>
                    <Text style={{fontSize:17, color:'black', marginHorizontal: 10}}>Senarai Item</Text>
                </View>
                
                <View>body</View>

                <View>Close button</View>

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
    },
})